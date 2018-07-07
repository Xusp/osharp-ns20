import { Component, AfterViewInit, Injector } from '@angular/core';
import { GridComponentBase } from '@shared/osharp/services/kendoui.service';
import { AuthConfig, Group } from '@shared/osharp/osharp.model';

@Component({
  selector: 'admin-security-role-entity',
  templateUrl: './role-entity.component.html',
})
export class RoleEntityComponent extends GridComponentBase implements AfterViewInit {

  splitterOptions: kendo.ui.SplitterOptions;
  filterGroup: Group;
  entityType: string;
  selectName: string = "未选择";

  constructor(injector: Injector) {
    super(injector);
    this.moduleName = "roleentity";
    this.splitterOptions = {
      panes: [{ size: "50%" }, { collapsible: true, collapsed: false }]
    };
  }

  async ngAfterViewInit() {
    await this.checkAuth();
    if (this.auth.Read) {
      super.InitBase();
      super.ViewInitBase();
    }
  }

  protected AuthConfig(): AuthConfig {
    return new AuthConfig("Root.Admin.Security.RoleEntity", ["Read", "Create", "Update", "Delete"])
  }

  protected GetModel() {
    return {
      id: "Id",
      fields: {
        Id: { type: "string", editable: false },
        RoleId: { type: "number", editable: false },
        EntityId: { type: "string", editable: false },
        RoleName: { type: "string", validation: { required: true } },
        EntityName: { type: "string", validation: { required: true } },
        EntityType: { type: "string", validation: { required: true } },
        FilterGroup: { type: "object" },
        IsLocked: { type: "boolean" },
        CreatedTime: { type: "date", editable: false }
      }
    };
  }

  protected GetGridColumns(): kendo.ui.GridColumn[] {
    const columns = [{
      command: [
        { name: "destroy", iconClass: "k-icon k-i-delete", text: "" },
        {}
      ],
      width: 100
    }, {
      field: "RoleId",
      title: "角色",
      width: 150,
      template: "#=RoleId#.#=RoleName#"
    }, {
      field: "EntityId",
      title: "数据实体",
      width: 300,
      template: "#=EntityName# [#=EntityType#]"
    }, {
      field: "IsLocked",
      title: "锁定",
      width: 95,
      template: d => this.kendoui.Boolean(d.IsLocked),
      editor: (container, options) => this.kendoui.BooleanEditor(container, options)
    }, {
      field: "CreatedTime",
      title: "注册时间",
      width: 115,
      format: "{0:yy-MM-dd HH:mm}"
    }];
    return columns;
  }

  protected GetGridOptions(dataSource: kendo.data.DataSource): kendo.ui.GridOptions {
    let options = super.GetGridOptions(dataSource);
    options.selectable = true;
    options.change = e => {
      let row = this.grid.select();
      if (row) {
        let data: any = this.grid.dataItem(row);
        if (data) {
          this.selectName = `角色:${data.RoleName} + 实体:${data.EntityName}`
          if (data.FilterGroup) {
            this.filterGroup = data.FilterGroup;
          } else {
            this.filterGroup = new Group();
          }
          this.entityType = data.EntityType;
        }
        else {
          this.selectName = "未选择";
          this.filterGroup = new Group();
          this.entityType = null;
        }
      } else {
        this.selectName = "未选择";
        this.filterGroup = new Group();
        this.entityType = null;
      }
    }

    return options;
  }
}