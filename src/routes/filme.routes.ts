import { FilmeController } from "../controller/filme.controller.js";
import { Router } from "express";

const router = Router();
const filmeController = new FilmeController();

router.get("/", (req, res) => filmeController.findAll(req, res));
router.get("/:id", (req, res) => filmeController.findById(req, res));
router.post("/", (req, res) => filmeController.create(req, res));
router.put("/:id", (req, res) => filmeController.update(req, res));
router.delete("/:id", (req, res) => filmeController.delete(req, res));

export {router as filmeRoutes};
