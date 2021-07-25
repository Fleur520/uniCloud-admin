
// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema



const validator = {
  "menu_id": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ]
  },
  "name": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ]
  },
  "enable": {
    "rules": [
      {
        "format": "bool"
      }
    ]
  },
  "menu_type": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
          {
            "text": "首页导航",
            "value": 1
          },
          {
            "text": "TOP菜单",
            "value": 2
          },
          {
            "text": "活动专区",
            "value": 3
          },
          {
            "text": "我的",
            "value": 4
          },
          {
            "text": "其他",
            "value": 5
          }
        ]
      }
    ],
    "defaultValue": 0,
    "label": "菜单类型"
  },
  "link_type": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
          {
            "text": "内链",
            "value": 1
          },
          {
            "text": "外链",
            "value": 2
          },
          {
            "text": "小程序",
            "value": 3
          },
          {
            "text": "APP",
            "value": 4
          },
          {
            "text": "其他",
            "value": 5
          }
        ]
      }
    ],
    "defaultValue": 0,
    "label": "跳转链接类型"
  }
}

const enumConverter = {
  "menu_type_valuetotext": {
    "1": "首页导航",
    "2": "TOP菜单",
    "3": "活动专区",
    "4": "我的",
	"5": "其他"
  },
  "link_type_valuetotext": {
    "1": "内链",
    "2": "外链",
    "3": "小程序",
    "4": "APP",
    "5": "其他"
  }
}

export { validator, enumConverter }
