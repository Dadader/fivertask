const client = require("../Connection/db_Connection");

module.exports.test_api = async (req, res) => {
    try
    {
        client.query(
            `SELECT * 
            FROM test_table`,
            async (error, result) => {
              if (!error) {
            
            res.status(200).send(result);
              } else {
                res.status(400).send("Query failed!");
              }
            }
          );
    } catch (error) {
        return res.status(500).json({ msg: `${error.message}` });
    }
}
