export interface Action_list_api_type {
  id:number
  base_type:1|2|3|4|5|6 // 1注册首存 2在存优惠 3一般优惠 4体验金 5 展示活动 6充值活动 (赛博：6 游戏救援金)
  base_name:string
  dis_code:string
  c_label:string
  c_title:string
  c_intro:string
  c_img:string
  t_apply_start_time:number
  t_apply_end_time:number,
  is_hot:0|1,
  jump_url:string,
  type_id:number
  jyj_price:number //明日/今日领取金额 （base_type = 6 才有此字段）
  jyj_type:1|2 //状态 1明日可领取 2今日可领取  base_type = 6 才有此字段）
}

export interface V2_action_jyjdetail_api_type {
  id:number
  base_type:number
  type_id:number
  auto_apply:number
  base_name?:string
  dis_code:string
  c_label:string
  t_apply_start_time:string
  t_apply_end_time:string
  c_title:string
  c_intro:string
  c_img:string
  c_detail:string
  is_hot:string
  jump_url:string
  date_type:string
  level_json:{
    level_name:string
    level:string
    proportion:string
    water:string
  }[]
  cashback:{
    level:string
    level_name:string
    proportion:string
    next_level:string
    next_level_name:string
    now_water:number
    now_ratio:number
    next_water:number
  }
  cashback_title:{
    proportion:string
    balance:number
  }
  return_start_time:string
  return_end_time:string
  jyj_price:number
}