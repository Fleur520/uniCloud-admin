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

  "link_url": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "sort": {
    "rules": [
      {
        "format": "int"
      }
    ]
  },

  "permission": {
    "rules": [
      {
        "format": "array"
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
  "create_date": {
    "rules": [
      {
        "format": "timestamp"
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
            "text": "问医菜单",
            "value": 1
          },
          {
            "text": "问医菜单",
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
            "value": 3
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
    "1": "医生首页菜单",
    "2": "问医菜单",
	"3": "活动专区",
    "3": "我的",
    "4": "其他"
  },
  "link_type_valuetotext": {
    "1": "内链",
    "2": "外链",
    "3": "小程序",
    "4": "APP",
    "5": "其他"
  }
}

function filterToWhere(filter, command) {
  let where = {}
  for (let field in filter) {
    let { type, value } = filter[field]
    switch (type) {
      case "search":
        if (typeof value === 'string' && value.length) {
          where[field] = new RegExp(value)
        }
        break;
      case "select":
        if (value.length) {
          let selectValue = []
          for (let s of value) {
            selectValue.push(command.eq(s))
          }
          where[field] = command.or(selectValue)
        }
        break;
      case "range":
        if (value.length) {
          let gt = value[0]
          let lt = value[1]
          where[field] = command.and([command.gte(gt), command.lte(lt)])
        }
        break;
      case "date":
        if (value.length) {
          let [s, e] = value
          let startDate = new Date(s)
          let endDate = new Date(e)
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
      case "timestamp":
        if (value.length) {
          let [startDate, endDate] = value
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
    }
  }
  return where
}

export { validator, enumConverter, filterToWhere }
