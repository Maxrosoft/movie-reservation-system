import cron from "node-cron";
import { Op } from "sequelize";
import Showtime from "../models/Showtime";

cron.schedule(
    "*/5 * * * *",
    async () => {
        const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);

        const deletedCount = await Showtime.destroy({
            where: {
                startTime: {
                    [Op.lte]: threeHoursAgo,
                },
            },
        });

        if (deletedCount > 0) {
            console.log(`Deleted ${deletedCount} expired showtimes`);
        }
    },
    {
        timezone: "UTC",
    }
);
