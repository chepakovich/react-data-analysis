const express = require('express')
const pg = require('pg')

const app = express()

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

// RATE LIMITER
let RateLimiter = require('./rateLimiter')
let limiter = new RateLimiter(5, 10000, true)
// applied to /events/daily API
// max 5 requests in 10 seconds from a specific IP address

// RELEVANT DB CONNECTION DATA SHOULD BE ENTERED HERE:
const PGHOST = 'work-samples-db.cx4wctygygyq.us-east-1.rds.amazonaws.com'
const PGPORT = '5432'
const PGDATABASE = 'work_samples'
const PGUSER = 'readonly'
const PGPASSWORD = 'w2UIO@#bg532!'

const pool = new pg.Pool({
  user: PGUSER,
  host: PGHOST,
  database: PGDATABASE,
  password: PGPASSWORD,
  port: PGPORT,
})

const queryHandler = (req, res, next) => {
  pool.query(req.sqlQuery).then((r) => {
    return res.json(r.rows || [])
  }).catch(next)
}

app.get('/', (req, res) => {
  res.send('Welcome to EQ Works 😎')
})

app.get('/events/hourly', (req, res, next) => {
  let withRowCount = req.query.withRowCount
  let pageNumber = req.query.pageNumber
  let limit = req.query.limit
  let timeConstraint = req.query.timeConstraint
  let sqlQuery = ''
  let rowCountQuery = ''
  rowCountQuery = `SELECT count(*) FROM public.hourly_events GROUP BY date, hour`
  req.sqlQuery = `
    SELECT date, hour, events, poi_id
    FROM public.hourly_events
    ORDER BY date, hour
    LIMIT ` + limit + ` OFFSET ` + (pageNumber - 1) * limit + `;`
    //console.log(req.sqlQuery)
    let result = { rowCount: 0, data: {}, withRowCount: withRowCount, pageNumber: pageNumber, limit: limit }
    pool.query(req.sqlQuery, function (err, dbdata) {
    result.data = dbdata.rows
    if (err) throw err
    //console.log(result)
    if (withRowCount == "true") {
      pool.query(rowCountQuery, function (err, rows, fields) {
        result.rowCount = rows.rowCount
        if (err) throw err
        res.send(result)
      })
    } else {
      res.send(result)
    }
  })
}, queryHandler)

app.get('/events/daily', (req, res, next) => {
  limiter.removeTokens(1, function(err, remainingRequests) {
    if (remainingRequests > 0) {
      let withRowCount = req.query.withRowCount
      let pageNumber = req.query.pageNumber
      let limit = req.query.limit
      let timeConstraint = req.query.timeConstraint
      let sqlQuery = ''
      let rowCountQuery = ''
      rowCountQuery = `SELECT count(*) FROM public.hourly_events GROUP BY date`
      req.sqlQuery = `
        SELECT date, SUM(events) AS events
        FROM public.hourly_events
        GROUP BY date
        ORDER BY date
        LIMIT ` + limit + ` OFFSET ` + (pageNumber - 1) * limit + `;`
        let result = { rowCount: 0, data: {}, withRowCount: withRowCount, pageNumber: pageNumber, limit: limit }
        pool.query(req.sqlQuery, function (err, dbdata) {
        result.data = dbdata.rows
        if (err) throw err
        //console.log(result)
        if (withRowCount == "true") {
          pool.query(rowCountQuery, function (err, rows, fields) {
            result.rowCount = rows.rowCount
            if (err) throw err
            res.send(result)
          })
        } else {
          res.send(result)
        }
      })
    } else {
      console.log('Maximum number of API requests has been reached')
      result = {}
      res.send(result)
    }
  })
}, queryHandler)

app.get('/stats/hourly', (req, res, next) => {
  let withRowCount = req.query.withRowCount
  let pageNumber = req.query.pageNumber
  let limit = req.query.limit
  let timeConstraint = req.query.timeConstraint
  let sqlQuery = ''
  let rowCountQuery = ''
  rowCountQuery = `SELECT count(*) FROM public.hourly_stats GROUP BY date, hour`
  req.sqlQuery = `
    SELECT date, hour, impressions, clicks, revenue, poi_id
    FROM public.hourly_stats
    ORDER BY date, hour
    LIMIT ` + limit + ` OFFSET ` + (pageNumber - 1) * limit + `;`
    let result = { rowCount: 0, data: {}, withRowCount: withRowCount, pageNumber: pageNumber, limit: limit }
    pool.query(req.sqlQuery, function (err, dbdata) {
    result.data = dbdata.rows
    if (err) throw err
    //console.log(result)
    if (withRowCount == "true") {
      pool.query(rowCountQuery, function (err, rows, fields) {
        result.rowCount = rows.rowCount
        if (err) throw err
        res.send(result)
      })
    } else {
      res.send(result)
    }
  })
}, queryHandler)

app.get('/stats/daily', (req, res, next) => {
  let withRowCount = req.query.withRowCount
  let pageNumber = req.query.pageNumber
  let limit = req.query.limit
  let timeConstraint = req.query.timeConstraint
  let sqlQuery = ''
  let rowCountQuery = ''
  rowCountQuery = `SELECT count(*) FROM public.hourly_stats GROUP BY date`
  req.sqlQuery = `
    SELECT date,
    SUM(impressions) AS impressions,
    SUM(clicks) AS clicks,
    SUM(revenue) AS revenue
    FROM public.hourly_stats
    GROUP BY date
    ORDER BY date
    LIMIT ` + limit + ` OFFSET ` + (pageNumber - 1) * limit + `;`
    let result = { rowCount: 0, data: {}, withRowCount: withRowCount, pageNumber: pageNumber, limit: limit }
    pool.query(req.sqlQuery, function (err, dbdata) {
    result.data = dbdata.rows
    if (err) throw err
    //console.log(result)
    if (withRowCount == "true") {
      pool.query(rowCountQuery, function (err, rows, fields) {
        result.rowCount = rows.rowCount
        if (err) throw err
        res.send(result)
      })
    } else {
      res.send(result)
    }
  })
}, queryHandler)

app.get('/poi', (req, res, next) => {
  //console.log('calling poi...')
  let sqlQuery = ''
  req.sqlQuery = `
    SELECT *
    FROM public.poi;
  `
  let result = {data: {}}
  pool.query(req.sqlQuery, function (err, dbdata) {
    result = dbdata.rows
    if (err) throw err
    //console.log(result)
    res.send(result)
  })
}, queryHandler)

app.listen(process.env.PORT || 5555, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  } else {
    console.log(`Running on ${process.env.PORT || 5555}`)
  }
})

// last resorts
process.on('uncaughtException', (err) => {
  console.log(`Caught exception: ${err}`)
  process.exit(1)
})
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
  process.exit(1)
})
