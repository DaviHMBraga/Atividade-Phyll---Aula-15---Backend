import { prisma } from "../prisma/client.js";

// Dados necessários para criar ou atualizar um filme
export type DadosFilme = {
    titulo: string;
    nota: number;
    imagem: string;
};

// O Prisma lança o código P2025 quando tentamos alterar/apagar um registro que não existe
function registroNaoEncontrado(erro: unknown): boolean {
    return typeof erro === "object" && erro !== null && (erro as { code?: string }).code === "P2025";
}

export class FilmeService {

    // Cria o filme e devolve o registro criado (já com id e createdAt)
    async create(dados: DadosFilme)
    {
        return await prisma.filme.create({
            data: {
                titulo: dados.titulo,
                nota: dados.nota,
                imagem: dados.imagem,
            },
        });
    }

    // Remove o filme. Devolve o filme removido, ou null se o id não existir
    async delete(id: number)
    {
        try {
            return await prisma.filme.delete({ where: { id } });
        } catch (erro) {
            if (registroNaoEncontrado(erro)) return null;
            throw erro;
        }
    }

    // Lista todos os filmes, do mais recente para o mais antigo
    async findAll()
    {
        return await prisma.filme.findMany({
            orderBy: { createdAt: "desc" },
        });
    }

    // Busca um filme pelo id. Devolve null se não existir
    async findById(id: number)
    {
        return await prisma.filme.findUnique({ where: { id } });
    }

    // Atualiza o filme e devolve o registro já atualizado, ou null se o id não existir
    async update(id: number, dados: DadosFilme)
    {
        try {
            return await prisma.filme.update({
                where: { id },
                data: {
                    titulo: dados.titulo,
                    nota: dados.nota,
                    imagem: dados.imagem,
                },
            });
        } catch (erro) {
            if (registroNaoEncontrado(erro)) return null;
            throw erro;
        }
    }

}
