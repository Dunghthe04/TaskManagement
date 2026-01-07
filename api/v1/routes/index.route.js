const task=require('./task.route')
const users=require('./users.route')
const authenMiddleware=require('../../../middleware/auth.middleware')

module.exports=(app)=>{
  app.use(`/api/v1/task`,authenMiddleware.requireAuthen,task)
  app.use(`/api/v1/users`,users)
}