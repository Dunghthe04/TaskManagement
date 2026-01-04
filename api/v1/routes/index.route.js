const task=require('./task.route')
const users=require('./users.route')

module.exports=(app)=>{
  app.use(`/api/v1/task`,task)
  app.use(`/api/v1/users`,users)
}