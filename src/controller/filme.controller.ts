import { Request, Response } from "express";
import { FilmeService } from "../services/filme.service.js";

const filmeService = new FilmeService();

// O id da URL precisa ser um número inteiro maior que zero
function idValido(id: number): boolean {
    return Number.isInteger(id) && id > 0;
}

// Confere o corpo da requisição. Devolve a mensagem de erro, ou "" se estiver tudo certo
function validarFilme(corpo: any): string {
    if (!corpo) {
        return "O corpo da requisição é obrigatório.";
    }
    if (typeof corpo.titulo !== "string" || corpo.titulo.trim() === "") {
        return "O campo 'titulo' é obrigatório e deve ser um texto.";
    }
    if (typeof corpo.imagem !== "string" || corpo.imagem.trim() === "") {
        return "O campo 'imagem' é obrigatório e deve ser um texto.";
    }
    if (typeof corpo.nota !== "number" || Number.isNaN(corpo.nota) || corpo.nota < 0 || corpo.nota > 10) {
        return "O campo 'nota' é obrigatório e deve ser um número entre 0 e 10.";
    }
    return "";
}

// Monta o objeto que vai para o service. Sem espaços sobrando no início e no fim
function montarDados(corpo: any) {
    return {
        titulo: corpo.titulo.trim(),
        imagem: corpo.imagem.trim(),
        nota: corpo.nota,
    };
}

export class FilmeController{

    // POST /filmes
    async create(req: Request, res: Response)
    {
        const mensagemErro = validarFilme(req.body);
        if (mensagemErro !== "") {
            return res.status(400).json({ erro: mensagemErro });
        }

        try {
            const filme = await filmeService.create(montarDados(req.body));
            return res.status(201).json(filme);
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ erro: "Erro interno ao criar o filme." });
        }
    }

    // DELETE /filmes/:id
    async delete(req: Request, res: Response)
    {
        const id = Number(req.params.id);
        if (!idValido(id)) {
            return res.status(400).json({ erro: "O id informado é inválido." });
        }

        try {
            const removido = await filmeService.delete(id);
            if (!removido) {
                return res.status(404).json({ erro: "Filme não encontrado." });
            }
            return res.status(204).send();
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ erro: "Erro interno ao remover o filme." });
        }
    }

    // PUT /filmes/:id
    async update(req: Request, res: Response)
    {
        const id = Number(req.params.id);
        if (!idValido(id)) {
            return res.status(400).json({ erro: "O id informado é inválido." });
        }

        const mensagemErro = validarFilme(req.body);
        if (mensagemErro !== "") {
            return res.status(400).json({ erro: mensagemErro });
        }

        try {
            const atualizado = await filmeService.update(id, montarDados(req.body));
            if (!atualizado) {
                return res.status(404).json({ erro: "Filme não encontrado." });
            }
            return res.status(200).json(atualizado);
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ erro: "Erro interno ao atualizar o filme." });
        }
    }

    // GET /filmes
    async findAll(req: Request, res: Response)
    {
        try {
            const filmes = await filmeService.findAll();
            return res.status(200).json(filmes);
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ erro: "Erro interno ao listar os filmes." });
        }
    }

    // GET /filmes/:id
    async findById(req: Request, res: Response)
    {
        const id = Number(req.params.id);
        if (!idValido(id)) {
            return res.status(400).json({ erro: "O id informado é inválido." });
        }

        try {
            const filme = await filmeService.findById(id);
            if (!filme) {
                return res.status(404).json({ erro: "Filme não encontrado." });
            }
            return res.status(200).json(filme);
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ erro: "Erro interno ao buscar o filme." });
        }
    }

}