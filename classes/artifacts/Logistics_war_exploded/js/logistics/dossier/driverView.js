Ext.namespace('Ext.customer');

Ext.customer.form = Ext.extend(Ext.FormPanel, {
    constructor : function(app) {
        this.app = app;


        this.kqSelector = new Ext.form.TriggerField({
            fieldLabel : '单位机构',
            name : 'company',
            anchor : '98%',
            triggerClass : 'x-form-search-trigger',
            selectOnFocus : true,
            submitValue : false,
            allowBlank : true,
            editable : false,
            onTriggerClick : function(e) {
                new kqSelector(function(id, name) {
                    this.setValue(name);
                    Ext.getCmp('companyId').setValue(id);
                    //	if(Ext.getCmp('loginName').getValue != ''){
                    //		Ext.getCmp('loginName').setValue(name);
                    //	}



                }, true, this);
            },
            scope : this
        });


        this.driverTypeSelector = new Ext.form.TriggerField({
            fieldLabel : '司机类型',
            name : 'driverType',
            anchor : '98%',
            triggerClass : 'x-form-search-trigger',
            selectOnFocus : true,
            submitValue : false,
            allowBlank : true,
            editable : false,
            onTriggerClick : function(e) {
                new driverTypeSelector(function(id, name) {
                    this.setValue(name);
                    Ext.getCmp('driverTypeId').setValue(id);
                    //	if(Ext.getCmp('loginName').getValue != ''){
                    //		Ext.getCmp('loginName').setValue(name);
                    //	}



                }, true, this);
            },
            scope : this
        });







        this.items = [{
            xtype : 'hidden',
            id : 'id'
        },{
            xtype : 'hidden',
            id : 'fleetId'
        },{
            xtype : 'hidden',
            id : 'companyId'
        },{
            xtype : 'hidden',
            id : 'driverTypeId'
        }, {
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
                store : new Ext.data.Store( {
                    proxy : new Ext.data.HttpProxy( {
                        url : path + '/system/getTreeAllFleetList.do',
                        method : 'POST'
                    }),
                    reader : new Ext.data.JsonReader({},
                        [{name : 'id'}, {name : 'fleetName'}]),
                    baseParams : {
                        fleetId:fleedId
                    },
                    autoLoad : true
                }),
                valueField : 'fleetName',
                displayField : 'fleetName',
                listeners : {
                    'select' : function(combo, record) {
                        this.getForm().findField('fleetId').setValue(record.data.id);
                        basefleedId = record.data.id;


                    },
                    scope : this
                }
            }]
        },{
            columnWidth : 1,
            items : [this.kqSelector]
        },{
            columnWidth : 1,
            items : [this.driverTypeSelector]
        },{
            columnWidth : 1,
            labelWidth : 60,
            items : [{
                fieldLabel : '司机姓名',
                xtype : 'textfield',
                name : 'driverName',
                anchor : '98%',
                allowBlank : false,
                selectOnFocus : true
            }]
        }, {
            columnWidth : 1,
            items : [{
                fieldLabel : '最近评分',
                xtype : 'textfield',
                name : 'score',
                anchor : '98%',
                selectOnFocus : true
            }]
        }, {
            columnWidth : 1,
            labelWidth : 60,
            items : [{
                xtype : 'combo',
                fieldLabel : '状态',
                hiddenName : 'statuesId',
                anchor : '98%',
                typeAhead : true,
                editable : false,
                triggerAction : 'all',
                lazyRender : true,
                mode : 'local',
                value:'在岗',
                store : new Ext.data.ArrayStore({
                    fields : ['key', 'val'],
                    data : [['在岗', '在岗'],
                        ['不在岗', '不在岗']]
                }),
                valueField : 'val',
                displayField : 'key'
            }]
        }, {
            columnWidth : 1,
            labelWidth : 60,
            items : [{
                xtype : 'combo',
                fieldLabel : '性别',
                hiddenName : 'sex',
                anchor : '98%',
                typeAhead : true,
                editable : false,
                triggerAction : 'all',
                lazyRender : true,
                mode : 'local',
                value:'男',
                store : new Ext.data.ArrayStore({
                    fields : ['key', 'val'],
                    data : [['男', '男'],
                        ['女', '女']]
                }),
                valueField : 'val',
                displayField : 'key'
            }]
        }, {
            columnWidth : 1,
            items : [{
                fieldLabel : '驾龄',
                xtype : 'numberfield',
                name : 'drivingExperience',
                anchor : '98%',
                selectOnFocus : true
            }]
        }, {
            columnWidth : 1,
            items : [{
                fieldLabel : '违章次数',
                xtype : 'numberfield',
                name : 'peccancyCount',
                anchor : '98%',
                selectOnFocus : true
            }]
        }, {
            columnWidth : 1,
            items : [{
                fieldLabel : '电话',
                xtype : 'textfield',
                name : 'tel',
                anchor : '98%',
                selectOnFocus : true
            }]
        }, {
            columnWidth : 1,
            items : [{
                fieldLabel : '联系地址',
                xtype : 'textfield',
                name : 'address',
                anchor : '98%',
                selectOnFocus : true
            }]
        }
        ];

        Ext.customer.form.superclass.constructor.call(this, {
            labelWidth : 60,
            baseCls : 'x-plain',
            layout : 'column',
            style : 'padding : 5',
            defaults : {
                baseCls : 'x-plain',
                layout : 'form'
            },
            listeners : {
                'render' : function(form) {
                    // form.roleCombo.getStore().reload();
                }
            }
        });
    }

});

Ext.customer.win = Ext.extend(Ext.Window, {
    constructor : function(app) {
        this.app = app;
        this.form = new Ext.customer.form(this);
        Ext.customer.win.superclass.constructor.call(this, {
            width : 300,
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
            var user = form.getValues();
            //user.isAdmin = user.isAdmin == 1 ? 1 : 0;
            //	Ext.ux.Toast.msg('信息', Ext.encode(user));
            Ext.eu.ajax(path + '/logistics/saveCustomer.do', {
                customer : Ext.encode(user)
            }, function(resp) {
                var res = Ext.decode(resp.responseText);
                if (res.label) {
                    Ext.ux.Toast.msg('信息', '保存成功');
                    this.app.getStore().reload();
                    this.close();
                } else {
                    Ext.ux.Toast.msg('提示', '客户名称已经存在！！！');
                    btn.setDisabled(false);
                }
            }, this);
        }
    },
    onClose : function() {
        this.close();
    }
});

Ext.customer.grid = Ext.extend(Ext.grid.GridPanel, {
    constructor : function(app) {
        this.app = app;
        // 数据源
        this.ds = new Ext.data.JsonStore({
            url : path + '/logistics/queryCustomer.do',
            idProperty : 'id',
            root : 'rows',
            totalProperty : 'results',
            fields : ['id', 'driverName', 'companyId', 'company','statuesId','sex','drivingExperience', 'peccancyCount', 'mobile','address','fleetName'],
            autoDestroy : true,
            autoLoad : true,
            baseParams : {
                isPaging : true,
                start : 0,
                limit : 40
            },
            listeners : {
                'beforeload' : function() {
                    Ext.apply(this.getStore().baseParams,
                        this.app.queryPanel.getQueryParams());

                },
                scope : this
            }
        });
        // 选择框
        this.sm = new Ext.grid.CheckboxSelectionModel({
            singleSelect : false
        });
        // 列
        this.cm = new Ext.grid.ColumnModel({
            defaults : {
                width : 150,
                sortable : true
            },
            columns : [new Ext.grid.RowNumberer(), this.sm, {
                header : 'id',
                dataIndex : 'id',
                hidden : true
            },{
                header : '司机姓名',
                dataIndex : 'driverName'

            },  {
                header : '所属机构',
                dataIndex : 'company',
                hidden : false
            },  {
                header : '当前状态',
                dataIndex : 'statuesId',
                hidden : false
            },  {
                header : '性别',
                dataIndex : 'sex',
                hidden : false
            },  {
                header : '驾龄',
                dataIndex : 'drivingExperience',
                hidden : false
            }, {
                header : '违章次数',
                dataIndex : 'peccancyCount',
                hidden : false
            },{
                header : '电话',
                dataIndex : 'mobile',
                hidden : false
            },{
                header : '联系地址',
                dataIndex : 'address',
                hidden : false
            },{
                header : '所属平台名称',
                dataIndex : 'fleetName',
                hidden : false
            },

            ]
        });
        // 菜单条
        this.tbar = new Ext.Toolbar([{
            id:'buttonAddCustomerView',
            xtype : 'button',
            iconCls : 'add',
            text : '新增',
            handler : this.onAdd,
            scope : this
        }, {
            id:'buttonModifyCustomerView',
            xtype : 'button',
            iconCls : 'modify',
            text : '修改',
            handler : this.onModify,
            scope : this
        }, {
            id:'buttonDelCustomerView',
            xtype : 'button',
            iconCls : 'delete',
            text : '删除',
            handler : this.onDelete,
            scope : this
        }]);
        // 页码条
        this.bbar = new Ext.PagingToolbar({
            pageSize : 40,
            displayInfo : true,
            store : this.ds
        });
        // 构造
        Ext.customer.grid.superclass.constructor.call(this, {
            region : 'center',
            loadMask : 'loading...',
            columnLines : true,
            clicksToEdit : 1,
            stripeRows : true,
            viewConfig : {
                forceFit : true
            }
        });
    },
    onAdd : function(btn) {
        var win = new Ext.customer.win(this);
        win.setTitle('添加客户', 'add');
        win.show();
    },
    onModify : function(btn) {
        var selects = Ext.eu.getSelects(this);
        if (selects.length == 0) {
            Ext.ux.Toast.msg("信息", "请选择要修改的记录！");
            return;
        }
        if (selects.length > 1) {
            Ext.ux.Toast.msg("信息", "只能选择一条记录！");
            return;
        }
        var select = selects[0].data;
        //Ext.ux.Toast.msg("信息", select.buyingTime);
        var win = new Ext.customer.win(this);
        var form = win.form.getForm();
        win.setTitle('修改客户', 'modify');
        form.findField('id').setValue(select.id);
        form.findField('fleetId').setValue(select.fleetId);
        form.findField('fleetName').setValue(select.fleetName);
        form.findField('company').setValue(select.company);

        form.findField('companyId').setValue(select.companyId);
        form.findField('driverName').setValue(select.driverName);
        form.findField('statuesId').setValue(select.statuesId);
        form.findField('sex').setValue(select.sex);


        form.findField('drivingExperience').setValue(select.drivingExperience);
        form.findField('peccancyCount').setValue(select.peccancyCount);


        win.show();
    },
    onDelete : function() {
        var selects = Ext.eu.getSelects(this);
        if (selects.length == 0) {
            Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
            return;
        }
        var ary = Array();
        for (var i = 0; i < selects.length; i++) {
            var user = {
                id : selects[i].data.id
            }
            ary.push(user);
        }

        // Ext.ux.Toast.msg("信息", Ext.encode(ary));
        Ext.Msg.confirm('删除操作', '确定要删除所选记录吗?', function(btn) {
            if (btn == 'yes') {
                Ext.eu.ajax(path + '/logistics/deleteCustomer.do', {
                    customers : Ext.encode(ary)
                }, function(resp) {
                    Ext.ux.Toast.msg('信息', '删除成功');
                    this.getStore().reload();
                }, this);
            }
        }, this);
    }
});

Ext.customer.queryPanel = Ext.extend(Ext.FormPanel, {
    constructor : function(app) {
        this.app = app;
        // 在column布局的制约下，从左至右每个元素依次进行form布局
        this.items = [{
            width : 250,
            items : [{
                xtype : 'textfield',
                fieldLabel : '司机姓名',
                id : 'driverName',
                anchor : '90%'
            }]
        }, {
            width : 250,
            items : [{
                xtype : 'textfield',
                fieldLabel : '所属机构',
                id : 'companyId',
                anchor : '90%'
            }]
        }, {
            width : 250,
            items : [{
                xtype : 'textfield',
                fieldLabel : '电话',
                id : 'tel',
                anchor : '90%'
            }]
        }, {
            width : 250,
            items : [{
                xtype : 'textfield',
                fieldLabel : '地址',
                id : 'address',
                anchor : '90%'
            }]
        },  {
            width : 65,
            items : [{
                xtype : 'button',
                id : 'linesQuery',
                text : '查询',
                iconCls : 'query',
                handler : function() {
                    this.app.grid.getStore().load();
                },
                scope : this
            }]
        }, {
            width : 65,
            items : [{
                xtype : 'button',
                id : 'linesReset',
                text : '清空',
                iconCls : 'reset',
                handler : function() {
                    this.getForm().reset();
                },
                scope : this
            }]
        }];
        // panel定义
        Ext.customer.queryPanel.superclass.constructor.call(this, {
            id : 'customerQueryPanel',
            region : 'north',
            height : 70,
            frame : true,
            split : true,
            collapseMode : 'mini',
            layout : 'column',
            labelAlign : 'right',
            defaults : {
                layout : 'form',
                labelWidth : 60
            }
        });
    },
    getQueryParams : function() {
        return this.getForm().getValues();
    }
});


/**
 * 入口方法，用于定位动态加载文件
 *
 * @return {}
 */
var driverView = function(params) {
    this.queryPanel = new Ext.customer.queryPanel(this);
    this.grid = new Ext.customer.grid(this);


    Ext.getCmp('buttonAddCustomerView').hidden=!params[0].isAdd;
    Ext.getCmp('buttonModifyCustomerView').hidden=!params[0].isModify;
    Ext.getCmp('buttonDelCustomerView').hidden=!params[0].isDel;


    console.log(params);

    return new Ext.Panel({
        id : 'driverView',// 标签页ID，必须与入口方法一致，用于判断标签页是否已经打开
        title : '司机档案',
        layout : 'border',
        items : [this.queryPanel, this.grid]
    })
}
