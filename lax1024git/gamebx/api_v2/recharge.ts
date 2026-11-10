import Request from "@/utils/Request";
import type { ApplyParams ,V2_user_offline_recharge_config_api_type,V2_user_offline_apply_api_type, V2_user_withdrawal_withdrawal_channel_api_type, V2_user_withdrawal_withdrawal_config_api_type, WithdrawalApply } from "~/types/recharge";
const request = new Request();

// 充值参数
export const v2_user_offline_recharge_config_api =()=>{
  return request.send<V2_user_offline_recharge_config_api_type>({
    url:"v2/user_offline/recharge_config",
    method:"get"
  })
}
// 确认充值
export const v2_user_offline_apply_api =(data:ApplyParams)=>{
  return request.send<V2_user_offline_apply_api_type>({
    url:"v2/user_offline/apply",
    method:"post",
    body:data
  })
}
// 提现渠道
export const v2_user_withdrawal_withdrawal_channel_api =()=>{
  return request.send<V2_user_withdrawal_withdrawal_channel_api_type>({
    url:"v2/user_withdrawal/withdrawal_channel",
    method:"get",
  })
}

// 提现参数
export const v2_user_withdrawal_withdrawal_config_api =(data:{bank_type:number|string})=>{
  return request.send<V2_user_withdrawal_withdrawal_config_api_type>({
    url:"v2/user_withdrawal/withdrawal_config",
    method:"post",
    body:data
  })
}

// 提现申请
export const v2_user_withdrawal_apply_api =(data:WithdrawalApply)=>{
  return request.send<[]>({
    url:"v2/user_withdrawal/apply",
    method:"post",
    body:data
  })
}

