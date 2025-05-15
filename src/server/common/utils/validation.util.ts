import { validate, ValidationError } from "class-validator";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { HttpException } from "@/server/common/exceptions/http-exception";

/**
 * Validates an object against a DTO class.
 * Throws HttpException if validation fails.
 * @param dtoClass The DTO class constructor
 * @param plainObject The plain object to validate (e.g., req.body)
 * @returns The validated and transformed DTO instance
 */
export async function validateDto<T extends object>(
  dtoClass: ClassConstructor<T>,
  plainObject: object,
): Promise<T> {
  const dtoInstance = plainToInstance(dtoClass, plainObject);
  const errors = await validate(dtoInstance, {
    whitelist: true, // Strip properties not defined in DTO
    forbidNonWhitelisted: true, // Throw error if extra properties are present
    stopAtFirstError: false, // Collect all errors
  });

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error: ValidationError) => {
        return Object.values(error.constraints || {});
      })
      .flat(); // Flatten the array of arrays of messages
    throw new HttpException(
      400,
      `Validation failed: ${errorMessages.join(", ")}`,
    );
  }
  return dtoInstance;
}
