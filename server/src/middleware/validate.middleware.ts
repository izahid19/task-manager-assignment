import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Validation source types
 */
type ValidationSource = 'body' | 'query' | 'params';

/**
 * Middleware factory for request validation using Zod schemas
 * @param schema - Zod schema to validate against
 * @param source - Source of data to validate (body, query, or params)
 * @returns Express middleware function
 */
export const validate = (schema: ZodSchema, source: ValidationSource = 'body') => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req[source];
      const validated = await schema.parseAsync(data);
      req[source] = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          if (!errors[path]) {
            errors[path] = [];
          }
          errors[path].push(err.message);
        });

        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
        });
        return;
      }
      next(error);
    }
  };
};
