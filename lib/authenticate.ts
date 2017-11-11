import {Helper} from './gAuthHelper'

Helper.createClient().then( client => {
  console.log("Sucessfully authenticated")
}).catch( error => {
  console.log("ERROR, could not authenticate with gmail", error)
})