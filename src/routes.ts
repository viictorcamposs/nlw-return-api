import express from "express";

import { PrismaFeedbacksRepository } from "./repositories/prisma/PrismaFeedbacksRepository";
import { NodemailerMailAdapter } from "./adapters/nodemailer/NodemailerMailAdapter";
import { SubmitFeedbackUseCase } from "./useCases/SubmitFeedbackUseCase";

export const routes = express.Router();

routes.post("/feedbacks", async (req, res) => {
  try {
    const { type, comment, screenshot } = req.body;

    const nodemailerMailAdapter = new NodemailerMailAdapter();
    const prismaFeedbacksRepository = new PrismaFeedbacksRepository();

    const submitFeedbacksUseCase = new SubmitFeedbackUseCase(
      prismaFeedbacksRepository,
      nodemailerMailAdapter
    );

    await submitFeedbacksUseCase.execute({
      type,
      comment,
      screenshot,
    });

    return res.status(201).send();
  } catch (error) {
    console.error(error);

    return res.status(500).send();
  }
});
