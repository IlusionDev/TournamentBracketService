import Controller from "@/controllers/base/controller";
import { MatchStatsService } from "@/domain/services/MatchStatsService";

export default class MatchController extends Controller {

    async saveMatchStats() {
        const { matchId, playerId, points } = this.req.body;
        const matchStatsService = new MatchStatsService();

        try {
            const matchStats = await matchStatsService.saveMatchStats({ matchId, playerId, points });

            return this.req.apiResponse.generateAndSendWithStatus(matchStats, {
                statusCode: 201,
                message: "Match stats created successfully"
            });
        } catch (e) {
            return this.req.apiResponse.generateAndSendErrorReponse(e);
        }

    }
    async updateMatchStats() {
        const { id, points, finished } = this.req.body;
        const matchStatsService = new MatchStatsService();

        try {
            const matchStats = await matchStatsService.updateMatchStats({ id, points, finished });

            return this.req.apiResponse.generateAndSendWithStatus(matchStats, {
                statusCode: 201,
                message: "Match stats created successfully"
            });
        } catch (e) {
            return this.req.apiResponse.generateAndSendErrorReponse(e);
        }

    }
}
