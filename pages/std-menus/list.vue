<template>
  <view>
    <view class="uni-header">

      <view class="uni-group">
        <view class="uni-title">医生助手菜单管理</view>
        <view class="uni-sub-title"></view>
      </view>
      <view class="uni-group">
        <input class="uni-search" type="text" v-model="query" @confirm="search" placeholder="请输入搜索内容" />
        <button class="uni-button" type="default" size="mini" @click="search">搜索</button>
        <button class="uni-button" type="default" size="mini" @click="navigateTo('./add')">新增</button>
        <button class="uni-button" type="default" size="mini" :disabled="!selectedIndexs.length" @click="delTable">批量删除</button>
        <download-excel class="hide-on-phone" :fields="exportExcel.fields" :data="exportExcelData" :type="exportExcel.type" :name="exportExcel.filename">
          <button class="uni-button" type="primary" size="mini">导出 Excel</button>
        </download-excel>
      </view>
    </view>
    <view class="uni-container">
      <unicloud-db ref="udb" collection="std-menus" field="menu_id,name,icon,link_url,sort,parent_id,permission,enable,create_date,menu_type,link_type" :where="where" page-data="replace"
        :orderby="orderby" :getcount="true" :page-size="options.pageSize" :page-current="options.pageCurrent"
        v-slot:default="{data,pagination,loading,error,options}" :options="options" loadtime="manual" @load="onqueryload">
        <uni-table ref="table" :loading="loading" :emptyText="error.message || '没有更多数据'" border stripe type="selection" @selection-change="selectionChange">
          <uni-tr>
          <!--  <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'menu_id')" sortable @sort-change="sortChange($event, 'menu_id')">menu_id</uni-th> -->
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'name')" sortable @sort-change="sortChange($event, 'name')">菜单名称</uni-th>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'icon')" sortable @sort-change="sortChange($event, 'icon')">图标icon
			</uni-th>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'link_url')" sortable @sort-change="sortChange($event, 'link_url')">跳转链接</uni-th>

      <!--      <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'parent_id')" sortable @sort-change="sortChange($event, 'parent_id')">父级菜单ID</uni-th>
 -->
			<uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'parent_id')" sortable @sort-change="sortChange($event, 'parent_id')">父级菜单名称</uni-th>


            <!-- <uni-th align="center" filter-type="timestamp" @filter-change="filterChange($event, 'create_date')" sortable @sort-change="sortChange($event, 'create_date')">create_date</uni-th> -->
            <uni-th align="center" filter-type="select" :filter-data="options.filterData.menu_type_localdata" @filter-change="filterChange($event, 'menu_type')">菜单类型</uni-th>
            <uni-th align="center" filter-type="select" :filter-data="options.filterData.link_type_localdata" @filter-change="filterChange($event, 'link_type')">跳转链接类型</uni-th>
            <uni-th align="center">操作</uni-th>
          </uni-tr>
          <uni-tr v-for="(item,index) in data" :key="index">
            <!-- <uni-td align="center">{{item.menu_id}}</uni-td> -->
            <uni-td align="center">{{item.name}}</uni-td>
            <uni-td align="center"><img  height="75px"  width="75px"  :src="item.icon"></uni-td>
            <uni-td align="center">{{item.link_url}}</uni-td>
			<!-- <uni-td align="center">{{item.enable == true ? '✅' : '❌'}}</uni-td> -->
           <!-- <uni-td align="center">{{item.parent_id}}</uni-td> -->
			<view class="uni-container">
			 <unicloud-db collection="std-menus" field="name" :where="`menu_id=='${item.parent_id}'`"
			 v-slot:default="{data,pagination,loading,error,options}" :getone="true" >

			<uni-td align="center" v-if="data==null">
				   &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;无 &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
			</uni-td>
			<uni-td align="center" v-if="data !=null">
			{{data.name}}
			</uni-td>

			 </unicloud-db>
			</view>


           <!-- <uni-td align="center">
              <uni-dateformat :threshold="[0, 0]" :date="item.create_date"></uni-dateformat>
            </uni-td> -->
            <uni-td align="center">{{options.menu_type_valuetotext[item.menu_type]}}</uni-td>
            <uni-td align="center">{{options.link_type_valuetotext[item.link_type]}}</uni-td>
            <uni-td align="center">
              <view class="uni-group">
                <button @click="navigateTo('./edit?id='+item._id, false)" class="uni-button" size="mini" type="primary">修改</button>
                <button @click="confirmDelete(item._id)" class="uni-button" size="mini" type="warn">删除</button>
              </view>
            </uni-td>
          </uni-tr>
        </uni-table>
        <view class="uni-pagination-box">
          <uni-pagination show-icon :page-size="pagination.size" v-model="pagination.current" :total="pagination.count" @change="onPageChanged" />
        </view>
      </unicloud-db>
    </view>
  </view>
</template>

<script>
  import { enumConverter, filterToWhere } from '../../js_sdk/validator/std-menus.js';

  const db = uniCloud.database()
  // 表查询配置
  const dbOrderBy = 'create_date desc' // 排序字段
  const dbSearchFields = ['name'] // 模糊搜索字段，支持模糊搜索的字段列表
  // 分页配置
  const pageSize = 20
  const pageCurrent = 1

  const orderByMapping = {
    "ascending": "asc",
    "descending": "desc"
  }

  export default {
    data() {
      return {
        query: '',
        where: '',
        orderby: dbOrderBy,
        orderByFieldName: "",
        selectedIndexs: [],
        options: {
          pageSize,
          pageCurrent,
          filterData: {
            "menu_type_localdata": [
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
            ],
            "link_type_localdata": [
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
          },
          ...enumConverter
        },
        imageStyles: {
          width: 64,
          height: 64
        },
        exportExcel: {
          "filename": "std-menus.xls",
          "type": "xls",
          "fields": {
            "menu_id": "menu_id",
            "name": "name",
            "icon": "icon",
            "link_url": "link_url",
            "sort": "sort",
            "parent_id": "parent_id",
            "permission": "permission",
            "enable": "enable",
            "create_date": "create_date",
            "菜单类型": "menu_type",
            "跳转链接类型": "link_type"
          }
        },
        exportExcelData: []
      }
    },
    onLoad() {
      this._filter = {}
    },
    onReady() {
      this.$refs.udb.loadData()
    },
    methods: {
      onqueryload(data) {
        this.exportExcelData = data
      },
      getWhere() {
        const query = this.query.trim()
        if (!query) {
          return ''
        }
        const queryRe = new RegExp(query, 'i')
        return dbSearchFields.map(name => queryRe + '.test(' + name + ')').join(' || ')
      },
      search() {
        const newWhere = this.getWhere()
        this.where = newWhere
        this.loadData()
      },
      loadData(clear = true) {
        this.$refs.udb.loadData({
          clear
        })
      },
      onPageChanged(e) {
        this.selectedIndexs.length = 0
        this.$refs.table.clearSelection()
        this.$refs.udb.loadData({
          current: e.current
        })
      },
      navigateTo(url, clear) {
        // clear 表示刷新列表时是否清除页码，true 表示刷新并回到列表第 1 页，默认为 true
        uni.navigateTo({
          url,
          events: {
            refreshData: () => {
              this.loadData(clear)
            }
          }
        })
      },
      // 多选处理
      selectedItems() {
        var dataList = this.$refs.udb.dataList
        return this.selectedIndexs.map(i => dataList[i]._id)
      },
      // 批量删除
      delTable() {
        this.$refs.udb.remove(this.selectedItems())
      },
      // 多选
      selectionChange(e) {
        this.selectedIndexs = e.detail.index
      },
      confirmDelete(id) {
        this.$refs.udb.remove(id)
      },
      sortChange(e, name) {
        this.orderByFieldName = name;
        if (e.order) {
          this.orderby = name + ' ' + orderByMapping[e.order]
        } else {
          this.orderby = ''
        }
        this.$refs.table.clearSelection()
        this.$nextTick(() => {
          this.$refs.udb.loadData()
        })
      },
      filterChange(e, name) {
        this._filter[name] = {
          type: e.filterType,
          value: e.filter
        }
        let newWhere = filterToWhere(this._filter, db.command)
        if (Object.keys(newWhere).length) {
          this.where = newWhere
        } else {
          this.where = ''
        }
        this.$nextTick(() => {
          this.$refs.udb.loadData()
        })
      }
    }
  }
</script>

<style>
</style>
