import React from "react";
import { SchemaField } from "./SchemaField";
import { Schema } from "amplication-data";

type Props = {
  schema: Schema;
  isDisabled?: boolean;
  applicationId: string;
};

export const SchemaFields = ({ schema, isDisabled, applicationId }: Props) => {
  if (schema === null) {
    return null;
  }

  if (schema.type !== "object") {
    throw new Error(`Unexpected type ${schema.type}`);
  }

  return Object.entries(schema.properties).map(([name, property]) => {
    if (!property) {
      throw new Error(`Missing property: ${name}`);
    }
    return (
      <div key={name}>
        <p>
          <SchemaField
            propertyName={name}
            propertySchema={property as Schema}
            isDisabled={isDisabled}
            applicationId={applicationId}
          />
        </p>
      </div>
    );
  });
};
