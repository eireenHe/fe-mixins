webpackJsonp([5],{"1cF7":function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=t("vLgD");var i={data:function(){return{nodeData:[{label:"首页"},{label:"配置中心",children:[{label:"业务流程管理"},{label:"规则包管理"},{label:"接口管理"}]}],defaultProps:{children:"children",label:"label"},curentNode:{},showEidtDialog:!1,editForm:{label:""},rules:{label:[{required:!0,message:"请输入菜单名字",trigger:"blur"}]},submitting:!1}},methods:{showContextmenu:function(e,n,t,o){this.$refs.contextmenu.show({top:e.clientY,left:e.clientX}),this.curentNode=t},addNode:function(e){console.log(this.curentNode),console.log(e)},editNode:function(e,n){this.showEidtDialog=!0,this.editForm.label=e.data.label},deleteNode:function(){var e=this;this.$confirm("此操作将永久删除该节点, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){e.$message({type:"success",message:"删除成功!"})}).catch(function(){e.$message({type:"info",message:"已取消删除"})})}},created:function(){var e;Object(o.a)({url:"/sqlConfig/queryCommonSql",method:"post",data:e}).then(function(e){console.log(e)}).catch(function(e){console.log("get menu node failed:::",e)})}},l={render:function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{staticClass:"content"},[t("el-tree",{ref:"tree",staticClass:"menuTree",attrs:{data:e.nodeData,"default-expand-all":!0,"expand-on-click-node":!1,props:e.defaultProps},on:{"node-contextmenu":e.showContextmenu},scopedSlots:e._u([{key:"default",fn:function(n){var o=n.node,i=n.data;return t("span",{staticClass:"custom-tree-node"},[t("span",[e._v(e._s(o.label))]),t("span",[t("i",{staticClass:"fa fa-pencil-square-o",on:{click:function(n){e.editNode(o,i)}}}),t("i",{staticClass:"fa fa-trash",on:{click:function(n){e.deleteNode(o,i)}}})])])}}])}),t("v-contextmenu",{ref:"contextmenu"},[t("v-contextmenu-item",{on:{click:function(n){e.addNode("child")}}},[e._v("添加子节点")]),t("v-contextmenu-item",{on:{click:function(n){e.addNode("up")}}},[e._v("添加上方节点")]),t("v-contextmenu-item",{on:{click:function(n){e.addNode("down")}}},[e._v("添加下方节点")])],1),t("el-dialog",{attrs:{title:"编辑节点",visible:e.showEidtDialog},on:{"update:visible":function(n){e.showEidtDialog=n}}},[t("el-form",{ref:"editForm",staticClass:"demo-ruleForm",attrs:{model:e.editForm,rules:e.rules,"label-width":"100px"}},[t("el-form-item",{attrs:{label:"菜单名字",prop:"label"}},[t("el-input",{attrs:{type:"text"},model:{value:e.editForm.label,callback:function(n){e.$set(e.editForm,"label",n)},expression:"editForm.label"}})],1),t("el-form-item",{staticStyle:{"text-align":"right","margin-bottom":"0"}},[t("el-button",{attrs:{size:"small"},on:{click:function(n){e.showEidtDialog=!1}}},[e._v("取消")]),t("el-button",{attrs:{size:"small",type:"primary",loading:e.submitting}},[e._v("保存")])],1)],1)],1)],1)},staticRenderFns:[]};var a=t("VU/8")(i,l,!1,function(e){t("Wnx8")},null,null);n.default=a.exports},Wnx8:function(e,n,t){var o=t("z3i5");"string"==typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);t("rjj0")("58262666",o,!0)},z3i5:function(e,n,t){(e.exports=t("FZ+f")(!0)).push([e.i,"\n.content {\n  background: #fff;\n  padding: 20px 30px;\n  min-height: calc(100vh - 100px);\n}\n.content .menuTree {\n  font-size: 14px;\n}\n.content .menuTree .fa {\n  margin-left: 5px;\n  font-size: 14px;\n}\n.content .menuTree .fa-plus,\n.content .menuTree .fa-pencil-square-o {\n  color: #409eff;\n}\n.content .menuTree .fa-trash {\n  color: #f56c6c;\n}","",{version:3,sources:["/Users/wdq/work/fe-credit-center/src/views/menuManage/list.vue"],names:[],mappings:";AACA;EACE,iBAAiB;EACjB,mBAAmB;EACnB,gCAAgC;CACjC;AACD;EACE,gBAAgB;CACjB;AACD;EACE,iBAAiB;EACjB,gBAAgB;CACjB;AACD;;EAEE,eAAe;CAChB;AACD;EACE,eAAe;CAChB",file:"list.vue",sourcesContent:["\n.content {\n  background: #fff;\n  padding: 20px 30px;\n  min-height: calc(100vh - 100px);\n}\n.content .menuTree {\n  font-size: 14px;\n}\n.content .menuTree .fa {\n  margin-left: 5px;\n  font-size: 14px;\n}\n.content .menuTree .fa-plus,\n.content .menuTree .fa-pencil-square-o {\n  color: #409eff;\n}\n.content .menuTree .fa-trash {\n  color: #f56c6c;\n}"],sourceRoot:""}])}});
//# sourceMappingURL=5.aff7d6bdbe7c0b0619e1.js.map