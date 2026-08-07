import { z } from "zod";

export const listMatchesQuerySchema = z.object({
  limit: z.coerce
    .number({ invalid_type_error: "Limit must be a number" })
    .int("Limit must be an integer")
    .positive("Limit must be a positive number")
    .max(100, "Limit must be at most 100")
    .optional(),
});

export const MATCH_STATUS = Object.freeze({
  SCHEDULED: "scheduled",
  LIVE: "live",
  FINISHED: "finished",
});

export const matchIdParamSchema = z.object({
  id: z.coerce
    .number({ invalid_type_error: "Id must be a number" })
    .int("Id must be an integer")
    .positive("Id must be a positive number"),
});

export const createMatchSchema = z
  .object({
    sport: z.string().trim().min(1, "Sport is required"),
    homeTeam: z.string().trim().min(1, "Home team is required"),
    awayTeam: z.string().trim().min(1, "Away team is required"),
    startTime: z
      .string()
      .trim()
      .refine((value) => !Number.isNaN(Date.parse(value)), {
        message: "Start time must be a valid ISO date string",
      }),
    endTime: z
      .string()
      .trim()
      .refine((value) => !Number.isNaN(Date.parse(value)), {
        message: "End time must be a valid ISO date string",
      }),
    homeScore: z.coerce
      .number({ invalid_type_error: "Home score must be a number" })
      .int("Home score must be an integer")
      .nonnegative("Home score must be non-negative")
      .optional(),
    awayScore: z.coerce
      .number({ invalid_type_error: "Away score must be a number" })
      .int("Away score must be an integer")
      .nonnegative("Away score must be non-negative")
      .optional(),
  })
  .superRefine((data, ctx) => {
    const startTime = Date.parse(data.startTime);
    const endTime = Date.parse(data.endTime);

    if (
      !Number.isNaN(startTime) &&
      !Number.isNaN(endTime) &&
      endTime <= startTime
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "End time must be after start time",
      });
    }
  });

export const updateScoreSchema = z.object({
  homeScore: z.coerce
    .number({ invalid_type_error: "Home score must be a number" })
    .int("Home score must be an integer")
    .nonnegative("Home score must be non-negative"),
  awayScore: z.coerce
    .number({ invalid_type_error: "Away score must be a number" })
    .int("Away score must be an integer")
    .nonnegative("Away score must be non-negative"),
});
