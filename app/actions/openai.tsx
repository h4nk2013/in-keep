'use server';
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod.mjs";
import * as z from "zod";

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
});
const BoardSchema = z.object({
    board: z.array(z.enum(["X", "O", "-"])).length(9),
});

const EMPTY_SPOT_TOKEN = '-';
export async function fetchOpenAIResponse(currentBoard: (string | null)[]): Promise<(string | null)[] | undefined> {
    try {
        const boardForAI = currentBoard.map((cell: string | null) => cell === null ? EMPTY_SPOT_TOKEN : cell);
        const prompt = `
        You are an expert, strategic Tic-Tac-Toe AI player ('O'). 
        Your sole task is to analyze the current board state and determine the single, optimal move for 'O' to win or block the opponent. 
        The board is a 9-element array where 'X' is the opponent, 'O' is your mark, and '${EMPTY_SPOT_TOKEN}' means the spot is open.
        Return ONLY the updated board state after 'O' has made its move.
        Do NOT include any commentary, analysis, or extra text.
        
        The current board state is: [${boardForAI.join(',')}]. Make the optimal move for 'O'.
        `;

        // 4. API Call
        const response = await openai.responses.parse({
            model: 'gpt-5.1',
            input: prompt,
            text: {
                format: zodTextFormat(BoardSchema, 'boardSchema'),
            },
        });

        const newBoardFromAI = response.output_parsed?.board;
        const updatedBoard = newBoardFromAI?.map((cell: string) => cell === EMPTY_SPOT_TOKEN ? null : cell);

        return updatedBoard;

    } catch (e) {
        console.error("Error fetching OpenAI response:", (e as Error).message);
        throw e;
    }
}