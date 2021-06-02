var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
// const manage_utils = require("./utils/manage_utils");


router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users")
      .then((users) => {
        if (users.find((x) => x.user_id === req.session.user_id)) {
          req.user_id = req.session.user_id;
          if (req.user_id === 11 ){
            next()        
          }
          else{
            res.sendStatus(403);
          }
        }
      })
      .catch((err) => next(err));
    
  } else {
    res.sendStatus(401);
  }
});

router.post("/createGame", async (req, res, next) => {
    try {

      await DButils.execQuery(
        `INSERT INTO dbo.games (home_team_id, away_team_id, date_time, stadium, referee_id) VALUES ('${req.body.home_team_id}', '${away_team_id}', '${req.body.date_time}', '${req.body.stadium}', '${req.body.referee_id}')`
      );
      res.status(201).send("Game created");
    } catch (error) {
      console.log(error)
      res.sendStatus(400);
    }
  });


router.post("/enterScore", async (req, res, next) => {
try {
    const game = (
        await DButils.execQuery(
          `SELECT * FROM dbo.games WHERE game_id = '${req.body.game_id}'`
        )
      )[0];

    let winner = 0
    if (req.body.home_goals > req.body.away_goals){
        winner = game.home_team_id
    }
    else if (req.body.home_goals < req.body.away_goals){
        winner = game.away_team_id
    }

    await DButils.execQuery(
    `UPDATE dbo.games SET home_goals = '${req.body.home_goals}', away_goals = '${req.body.away_goals}', winner_team_id = '${winner}' WHERE game_id = '${req.body.game_id}' `
    );
    res.status(201).send("Game Updated");
} catch (error) {
    console.log(error)
    res.sendStatus(400);
}
});

module.exports = router;