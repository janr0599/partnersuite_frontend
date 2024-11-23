import z from "zod";
import {
    topUpRequestSchema,
    topUpRequestsSchema,
    topUpRequestStatusSchema,
} from "@/schemas/topUpRequestsSchemas";

export type TopUpRequestStatus =
    (typeof topUpRequestStatusSchema)[keyof typeof topUpRequestStatusSchema];

export type TopUpRequest = z.infer<typeof topUpRequestSchema>;

export type TopUpRequests = z.infer<typeof topUpRequestsSchema>;

export type TopUpRequestFormData = {
    // amount: number;
    status: TopUpRequestStatus;
};

export type TopUpRequestAPI = {
    topUpRequestId: TopUpRequest["_id"];
    formData: TopUpRequestFormData;
    status: TopUpRequest["status"];
};
