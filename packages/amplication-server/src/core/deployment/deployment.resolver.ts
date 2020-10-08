import { UseGuards, UseFilters } from '@nestjs/common';
import {
  Args,
  Mutation,
  Resolver,
  Query,
  Parent,
  ResolveField
} from '@nestjs/graphql';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { Deployment } from './dto/Deployment';
import { CreateDeploymentArgs } from './dto/CreateDeploymentArgs';
import { FindOneDeploymentArgs } from './dto/FindOneDeploymentArgs';
import { FindManyDeploymentArgs } from './dto/FindManyDeploymentArgs';
import { DeploymentService } from './deployment.service';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
import { InjectContextValue } from 'src/decorators/injectContextValue.decorator';
import { InjectableResourceParameter } from 'src/enums/InjectableResourceParameter';
import { User } from 'src/models';
import { UserService } from '../user/user.service';

@Resolver(() => Deployment)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class DeploymentResolver {
  constructor(
    private readonly service: DeploymentService,
    private readonly userService: UserService
  ) {}

  @Query(() => [Deployment])
  @AuthorizeContext(
    AuthorizableResourceParameter.EnvironmentId,
    'where.environment.id'
  )
  async deployments(
    @Args() args: FindManyDeploymentArgs
  ): Promise<Deployment[]> {
    return this.service.findMany(args);
  }

  @Query(() => Deployment)
  @AuthorizeContext(AuthorizableResourceParameter.DeploymentId, 'where.id')
  async deployment(@Args() args: FindOneDeploymentArgs): Promise<Deployment> {
    return this.service.findOne(args);
  }

  @ResolveField()
  async createdBy(@Parent() deployment: Deployment): Promise<User> {
    return this.userService.findUser({ where: { id: deployment.userId } });
  }

  @Mutation(() => Deployment)
  @InjectContextValue(
    InjectableResourceParameter.UserId,
    'data.createdBy.connect.id'
  )
  @AuthorizeContext(
    AuthorizableResourceParameter.EnvironmentId,
    'data.environment.connect.id'
  )
  async createDeployment(
    @Args() args: CreateDeploymentArgs
  ): Promise<Deployment> {
    return this.service.create(args);
  }
}