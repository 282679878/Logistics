Ext.namespace('Ext.menu');

Ext.menu.menuForm = Ext.extend(Ext.FormPanel, {
			constructor : function(app) {
				this.app = app;


                this.fleetTypeDS = new Ext.data.Store({
                    proxy : new Ext.data.HttpProxy({
                        url : path + '/system/getTreeAllFleetList.do',
                        method : 'POST'
                    }),
                    reader : new Ext.data.JsonReader({},
                        [{name : 'id'}, {name : 'fleetName'}]),

                    baseParams : {
                        fleetId:fleedId
                    }
                });
                this.fleetTypeDS.load();


                this.items = [{
							xtype : 'hidden',
							fieldLabel : 'Id',
							id : 'id'
						}, {
							xtype : 'hidden',
							fieldLabel : 'fatherId',
							id : 'fatherId'
						},{
							xtype : 'hidden',
							fieldLabel : 'fleetId',
							id : 'fleetId'
						}, {
							columnWidth : 1,
							items : [{
										fieldLabel : '父节点',
										xtype : 'textfield',
										id : 'fatherText',
										anchor : '100%',
										readOnly : true,
										submitValue : false,
										style : 'background:#E6E6E6',
										value : 'root'
									}]
						},{
							columnWidth : 1,
							labelWidth : 60,
							items : [{
								id:'fleetName',
								fieldLabel : '所属平台',
								width : 60,
								xtype : 'combo',
								hiddenName : 'fleetName',
								submitValue : false,
								anchor : '98%',
								editable : false,
								autoLoad : true,
								triggerAction : 'all',
								mode : 'local',
								store : this.fleetTypeDS,
								valueField : 'fleetName',
								displayField : 'fleetName',
								listeners : {
									'select' : function(combo, record) {
										console.log(record);
											this.getForm().findField('fleetId').setValue(record.data.id);
									},
									scope : this
								}
							}]
						}, {
							columnWidth : 1,
							items : [{
								fieldLabel : '单位编号',
								xtype : 'textfield',
								id : 'companyNo',
								anchor : '100%',
								selectOnFocus : true
							}]
						},{
							columnWidth : 1,
							items : [{
										fieldLabel : '<font color="red">单位名称</font>',
										xtype : 'textfield',
										id : 'company',
										maxLength : 18,
										maxLengthText : '名称不能大于18个字符',
										anchor : '100%',
										selectOnFocus : true,
										allowBlank : false
									}]
						},{
                    columnWidth : 1,
                    items : [{
                        fieldLabel : '联系电话',
                        xtype : 'textfield',
                        id : 'tel',
                        anchor : '100%',
                        selectOnFocus : true
                    }]
                }, {
                    columnWidth : 1,
                    items : [{
                        fieldLabel : '地址',
                        xtype : 'textfield',
                        id : 'address',
                        anchor : '100%',
                        selectOnFocus : true
                    }]
                }];

				Ext.menu.menuForm.superclass.constructor.call(this, {
							labelWidth : 60,
							baseCls : 'x-plain',
							layout : 'column',
							style : 'padding : 5',
							defaults : {
								baseCls : 'x-plain',
								layout : 'form'
							}
						});
			}
		});



Ext.menu.menuWin = Ext.extend(Ext.Window, {
			constructor : function(app) {
				this.app = app;



				this.form = new Ext.menu.menuForm(this);
				Ext.menu.menuWin.superclass.constructor.call(this, {
							width : 500,
							plain : true,
							showLock : true,
							modal : true,
							resizable : false,
							buttonAlign : 'center',
							items : this.form,
							buttons : [{
										text : '保存',
										iconCls : 'save',
										handler : this.onSave,
										scope : this
									}, {
										text : '取消',
										iconCls : 'cancel',
										handler : this.onClose,
										scope : this
									}]
						});
			},
			onSave : function(btn) {
				var form = this.form.getForm();
				if (form.isValid()) {
					btn.setDisabled(true);
					var params = {
						company : Ext.encode(form.getValues())
					};
					Ext.eu.ajax(path + '/system/saveCompany.do', params, function(
									resp) {
								var res = Ext.decode(resp.responseText);
								if (res.label) {
									Ext.ux.Toast.msg('信息', '保存成功');
									this.app.getRootNode().reload();
									refreshSysMenu();
									this.close();
								} else {
									Ext.ux.Toast.msg('提示', '保存的记录存在重名');
									btn.setDisabled(false);
								}
							}, this);
				}
			},
			onClose : function() {
				this.close();
			}
		});


Ext.menu.tree = Ext.extend(Ext.ux.tree.TreeGrid, {
			constructor : function(app) {
				this.app = app;
				// 父级目录
				this.fatherMenu = new Ext.menu.Menu({
							items : [{
										text : '添加机构',
										iconCls : 'add',
										handler : this.onAdd,
										scope : this
									}, {
										text : '添加子机构',
										iconCls : 'plugin_add',
										handler : this.onAddChild,
										scope : this
									},{
										text : '修改机构',
										iconCls : 'modify',
										handler : this.onModify,
										scope : this
									}, {
										text : '删除机构',
										iconCls : 'delete',
										handler : this.onDelete,
										scope : this
									}]
						});
				// 叶子目录
				this.leafMenu = new Ext.menu.Menu({
							items : [{
										text : '修改机构',
										iconCls : 'modify',
										handler : this.onModify,
										scope : this
									}, {
										text : '删除机构',
										iconCls : 'delete',
										handler : this.onDelete,
										scope : this
									}]
						});

				// 工具条
				this.tbar = ['-', {
							text : '刷新',
							iconCls : 'refresh',
							id : 'menusRefreshBtn',
							handler : function() {
								this.getRootNode().reload()
							},
							scope : this
						}, {
							text : '查询',
							iconCls : 'query',
							id : 'query',
							handler : function() {
							},
							scope : this
						}];
				// 列
				this.columns = [{
							header : '单位编号',
							width : 300,
							dataIndex : 'companyNo'
						}, {
							header : '单位公司机构名称',
							width : 300,
							dataIndex : 'company'
						}, {
							header : '联系电话',
							width : 200,
							dataIndex : 'tel'
						}, {
							header : '地址',
							width : 300,
							dataIndex : 'address'
						},{
							header : '所属平台',
								width : 300,
								dataIndex : 'fleetName'
						}];
				this.root = new Ext.tree.AsyncTreeNode({
							text : 'Root',
							id : '0'
						});
				Ext.menu.tree.superclass.constructor.call(this, {
							enableDD : true,
							region : 'center',
							enableSort : false,// 禁用排序，不然的话咧，管你后台排序多正常，前台都要按照名称再排一遍，乱序了吧，吃瘪了吧
							loader : new Ext.tree.TreeLoader({
										url : path + '/system/getTreeAllCompanyList.do',
										baseParams : {
											fleetId:fleedId
										}
									}),
							listeners : {
								contextmenu : {
									fn : function(node, event) {
										// 必须写，使用preventDefault方法可防止浏览器的默认事件操作发生。
										console.log(node);
										event.preventDefault();
										node.select();
										if (node.attributes.isBtn) {
											this.btnMenu.showAt(event.getXY());
										} else {
											if (node.attributes.fatherId !='0') {
												this.leafMenu.showAt(event
														.getXY());
											} else {
												this.fatherMenu.showAt(event
														.getXY());
											}
										}
									},
									scope : this
								}
							}
						});
			},
			onAdd : function() {
				var win = new Ext.menu.menuWin(this);
				var form = win.form.getForm();
				win.show();
				win.setTitle('添加机构', 'add');
				form.findField('fatherText').setValue('Root');
				form.findField('fatherId').setValue(0);
			},
			onAddChild : function() {
				var node = this.getSelectionModel().getSelectedNode();
				if (node) {
					if (!node.attributes.menuLeaf) {
						var win = new Ext.menu.menuWin(this);
						var form = win.form.getForm();
                        Ext.getCmp('fleetName').hidden=true;
						win.show();
						win.setTitle('添加子机构', 'plugin_add');
						form.findField('fatherText').setValue(node.attributes.company);
						form.findField('fatherId').setValue(node.attributes.id);
                        form.findField('fleetId').setValue(node.attributes.fleetId);
                        form.findField('fleetName').setValue(node.attributes.fleetName);
					} else {
						Ext.ux.Toast.msg('信息', '叶子节点不允许添加子节点，请先修改当前节点为非叶子属性');
					}
				}
			},
			onModify : function() {
				var node = this.getSelectionModel().getSelectedNode();
				console.log(node);
				if (node) {
					var win = new Ext.menu.menuWin(this);
					var form = win.form.getForm();
					win.show();
					win.setTitle('修改机构信息', 'modify');
					form.findField('id').setValue(node.id);
                    form.findField('fleetId').setValue(node.attributes.fleetId);
					form.findField('companyNo').setValue(node.attributes.companyNo);
					form.findField('company').setValue(node.attributes.company);
					form.findField('tel').setValue(node.attributes.tel);
					form.findField('address').setValue(node.attributes.address);
                    form.findField('fleetName').setValue(node.attributes.fleetName);
					if (node.attributes.fatherId == 0) {
						form.findField('fatherId').setValue(0);
						form.findField('fatherText').setValue('Root');
					} else {
						form.findField('fatherId').setValue(node.parentNode.attributes.id);
						form.findField('fatherText')
								.setValue(node.parentNode.attributes.company);
					}

				}
			},
			onDelete : function() {
				var node = this.getSelectionModel().getSelectedNode();
				if (node.childNodes != '') {
					Ext.ux.Toast.msg('信息', '请先删除子机构');
					return;
				}
				Ext.Msg.confirm('删除操作', '确定要删除选中机构信息吗?', function(btn) {
							if (btn == 'yes') {
								Ext.eu.ajax(path + '/system/deleteCompany.do', {
											company : Ext.encode({
														id : node.id
													})
										}, function(resp) {
											Ext.ux.Toast.msg('信息', '删除成功');
											this.getRootNode().reload();// 刷新当前树
											refreshSysMenu();
										}, this);
							}
						}, this);
			},
			onAddBtn : function() {
				var node = this.getSelectionModel().getSelectedNode();
				var win = new Ext.menu.btnWin(this);
				var form = win.form.getForm();
				win.show();
				win.setTitle('添加按钮', 'add');
				form.findField('menuId').setValue(node.id);
				form.findField('menuText').setValue(node.text);
			},
			onModifyBtn : function() {
				var node = this.getSelectionModel().getSelectedNode();
				if (node) {
					var win = new Ext.menu.btnWin(this);
					var form = win.form.getForm();
					win.show();
					win.setTitle('修改按钮', 'modify');
					form.findField('id').setValue(node.id);
					form.findField('text').setValue(node.text);
					form.findField('iconCls').setValue(node.attributes.iconCls);
					form.findField('seq').setValue(node.attributes.seq);
					form.findField('menuId').setValue(node.parentNode.id);
					form.findField('menuText').setValue(node.parentNode.text);
					form.findField('btnKey').setValue(node.attributes.btnKey);
				}
			},

		});

/**
 * 刷新系统目录
 */
var refreshSysMenu = function() {
	var leftPanel = Ext.getCmp('west_panel');
	leftPanel.removeAll(true);
	menuRefresh(leftPanel);
}

/**
 * 初始化界面
 * 
 * @return {}
 */
var companyView = function() {
	return new Ext.Panel({
				id : 'companyView',// 灰蚕重要,一定要跟方法名称一样
				title : '单位机构管理',
				layout : 'border',
				items : new Ext.menu.tree(this)
			});
}