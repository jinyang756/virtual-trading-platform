#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

// Swagger 文档模板
const swaggerTemplate = {
  openapi: "3.0.0",
  info: {
    title: "虚拟交易平台 API",
    description: "虚拟交易平台的完整API文档",
    version: "1.0.0"
  },
  servers: [
    {
      url: "http://localhost:3001",
      description: "本地开发服务器"
    }
  ],
  paths: {},
  components: {
    schemas: {
      // 基础响应结构
      ApiResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean"
          },
          message: {
            type: "string"
          },
          data: {
            type: "object"
          },
          error: {
            type: "object",
            properties: {
              code: {
                type: "string"
              },
              message: {
                type: "string"
              }
            }
          }
        }
      },
      
      // 用户相关结构
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          username: { type: "string" },
          email: { type: "string" },
          balance: { type: "number" },
          role: { type: "string" }
        }
      },
      
      // 基金相关结构
      Fund: {
        type: "object",
        properties: {
          fund_id: { type: "string" },
          name: { type: "string" },
          fund_manager: { type: "string" },
          risk_level: { type: "string" },
          nav: { type: "number" },
          min_investment: { type: "number" },
          management_fee: { type: "number" },
          performance_fee: { type: "number" },
          total_return: { type: "number" },
          update_time: { type: "string", format: "date-time" }
        }
      },
      
      // 交易相关结构
      Trade: {
        type: "object",
        properties: {
          id: { type: "string" },
          user_id: { type: "string" },
          symbol: { type: "string" },
          quantity: { type: "number" },
          price: { type: "number" },
          amount: { type: "number" },
          fee: { type: "number" },
          status: { type: "string" },
          timestamp: { type: "string", format: "date-time" }
        }
      },
      
      // 持仓相关结构
      Position: {
        type: "object",
        properties: {
          id: { type: "string" },
          user_id: { type: "string" },
          symbol: { type: "string" },
          quantity: { type: "number" },
          average_price: { type: "number" },
          current_price: { type: "number" },
          market_value: { type: "number" },
          profit_loss: { type: "number" },
          timestamp: { type: "string", format: "date-time" }
        }
      },
      
      // 工作流相关结构
      Workflow: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          type: { type: "string" },
          status: { type: "string" },
          created_by: { type: "string" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" }
        }
      },
      
      // 任务相关结构
      Task: {
        type: "object",
        properties: {
          id: { type: "string" },
          workflow_id: { type: "string" },
          name: { type: "string" },
          status: { type: "string" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" }
        }
      }
    }
  }
};

// API路径定义
const apiPaths = {
  // 认证相关
  "/api/users/login": {
    post: {
      summary: "用户登录",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                username: { type: "string" },
                password: { type: "string" }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "登录成功",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: {
                      data: {
                        type: "object",
                        properties: {
                          token: { type: "string" },
                          userId: { type: "string" },
                          username: { type: "string" }
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  },
  
  "/api/users/register": {
    post: {
      summary: "用户注册",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                username: { type: "string" },
                email: { type: "string" },
                password: { type: "string" }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "注册成功",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: {
                      data: {
                        type: "object",
                        properties: {
                          userId: { type: "string" }
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  },
  
  // 用户管理相关
  "/api/users/profile": {
    get: {
      summary: "获取用户信息",
      responses: {
        "200": {
          description: "获取用户信息成功",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/User" }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    },
    put: {
      summary: "更新用户信息",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                username: { type: "string" },
                email: { type: "string" }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "更新用户信息成功",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/User" }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  },
  
  // 基金相关
  "/api/fund/": {
    get: {
      summary: "获取所有基金信息",
      responses: {
        "200": {
          description: "获取基金列表成功",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Fund" }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  },
  
  "/api/fund/{fundId}": {
    get: {
      summary: "获取特定基金信息",
      parameters: [
        {
          name: "fundId",
          in: "path",
          required: true,
          schema: {
            type: "string"
          }
        }
      ],
      responses: {
        "200": {
          description: "获取基金信息成功",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/Fund" }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  },
  
  "/api/fund/{fundId}/nav-history": {
    get: {
      summary: "获取基金净值历史",
      parameters: [
        {
          name: "fundId",
          in: "path",
          required: true,
          schema: {
            type: "string"
          }
        },
        {
          name: "startDate",
          in: "query",
          required: false,
          schema: {
            type: "string",
            format: "date"
          }
        },
        {
          name: "endDate",
          in: "query",
          required: false,
          schema: {
            type: "string",
            format: "date"
          }
        }
      ],
      responses: {
        "200": {
          description: "获取净值历史成功",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            date: { type: "string", format: "date" },
                            nav: { type: "number" },
                            change: { type: "number" }
                          }
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  },
  
  // 交易相关
  "/api/trade/contract/order": {
    post: {
      summary: "下合约订单",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                symbol: { type: "string" },
                quantity: { type: "number" },
                leverage: { type: "number" },
                side: { type: "string", enum: ["buy", "sell"] },
                stopLoss: { type: "number" },
                takeProfit: { type: "number" }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "订单创建成功",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: {
                      data: {
                        type: "object",
                        properties: {
                          orderId: { type: "string" },
                          symbol: { type: "string" },
                          quantity: { type: "number" },
                          leverage: { type: "number" },
                          side: { type: "string" },
                          price: { type: "number" },
                          timestamp: { type: "string", format: "date-time" }
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  },
  
  "/api/trade/contract/positions": {
    get: {
      summary: "获取用户持仓",
      responses: {
        "200": {
          description: "获取持仓成功",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Position" }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  },
  
  // 工作流相关
  "/api/workflow": {
    post: {
      summary: "创建工作流",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                workflowType: { type: "string" },
                config: { type: "object" }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "工作流创建成功",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/Workflow" }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    },
    get: {
      summary: "获取工作流列表",
      parameters: [
        {
          name: "page",
          in: "query",
          required: false,
          schema: {
            type: "integer",
            default: 1
          }
        },
        {
          name: "limit",
          in: "query",
          required: false,
          schema: {
            type: "integer",
            default: 10
          }
        },
        {
          name: "status",
          in: "query",
          required: false,
          schema: {
            type: "string"
          }
        },
        {
          name: "type",
          in: "query",
          required: false,
          schema: {
            type: "string"
          }
        }
      ],
      responses: {
        "200": {
          description: "获取工作流列表成功",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: {
                      data: {
                        type: "object",
                        properties: {
                          workflows: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Workflow" }
                          },
                          pagination: {
                            type: "object",
                            properties: {
                              page: { type: "integer" },
                              limit: { type: "integer" },
                              totalCount: { type: "integer" },
                              totalPages: { type: "integer" }
                            }
                          }
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  },
  
  "/api/workflow/{id}": {
    get: {
      summary: "获取工作流详情",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string"
          }
        }
      ],
      responses: {
        "200": {
          description: "获取工作流详情成功",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: {
                      data: {
                        type: "object",
                        properties: {
                          workflow: { $ref: "#/components/schemas/Workflow" },
                          tasks: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Task" }
                          }
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  },
  
  "/api/workflow/{id}/start": {
    post: {
      summary: "启动工作流",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string"
          }
        }
      ],
      responses: {
        "200": {
          description: "工作流启动成功",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: {
                      data: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          status: { type: "string" },
                          updatedAt: { type: "string", format: "date-time" }
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  },
  
  "/api/workflow/{id}/cancel": {
    post: {
      summary: "取消工作流",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string"
          }
        }
      ],
      responses: {
        "200": {
          description: "工作流取消成功",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ApiResponse" },
                  {
                    type: "object",
                    properties: {
                      data: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          status: { type: "string" },
                          updatedAt: { type: "string", format: "date-time" }
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  }
};

class SwaggerGenerator {
  constructor() {
    this.swagger = { ...swaggerTemplate };
    this.swagger.paths = { ...apiPaths };
  }

  // 生成Swagger文档
  async generate(outputPath) {
    console.log('🚀 正在生成Swagger文档...');
    
    try {
      // 确保输出目录存在
      const outputDir = path.dirname(outputPath);
      try {
        await fs.access(outputDir);
      } catch (error) {
        await fs.mkdir(outputDir, { recursive: true });
      }
      
      // 写入Swagger JSON文件
      const swaggerJson = JSON.stringify(this.swagger, null, 2);
      await fs.writeFile(outputPath, swaggerJson);
      
      console.log(`✅ Swagger文档已生成: ${outputPath}`);
      console.log(`📊 API端点数量: ${Object.keys(this.swagger.paths).length}`);
      console.log(`📂 Schema定义数量: ${Object.keys(this.swagger.components.schemas).length}`);
      
      return outputPath;
    } catch (error) {
      console.error('❌ 生成Swagger文档失败:', error.message);
      throw error;
    }
  }
  
  // 生成API文档报告
  async generateReport(outputPath) {
    console.log('📝 正在生成API文档报告...');
    
    try {
      let report = '# API 文档生成报告\n\n';
      report += `生成时间: ${new Date().toISOString()}\n\n`;
      report += '## 统计信息\n\n';
      report += `- API端点数量: ${Object.keys(this.swagger.paths).length}\n`;
      report += `- Schema定义数量: ${Object.keys(this.swagger.components.schemas).length}\n\n`;
      
      report += '## API端点列表\n\n';
      for (const path in this.swagger.paths) {
        report += `### ${path}\n\n`;
        const methods = this.swagger.paths[path];
        for (const method in methods) {
          const operation = methods[method];
          report += `- **${method.toUpperCase()}** ${operation.summary || ''}\n`;
        }
        report += '\n';
      }
      
      report += '## Schema定义\n\n';
      for (const schemaName in this.swagger.components.schemas) {
        report += `- ${schemaName}\n`;
      }
      
      // 写入报告文件
      await fs.writeFile(outputPath, report);
      console.log(`✅ API文档报告已生成: ${outputPath}`);
      
      return outputPath;
    } catch (error) {
      console.error('❌ 生成API文档报告失败:', error.message);
      throw error;
    }
  }
}

// 主执行函数
async function main() {
  const generator = new SwaggerGenerator();
  
  try {
    // 生成Swagger文档
    const swaggerPath = await generator.generate('docs/swagger.json');
    
    // 生成API文档报告
    const reportPath = await generator.generateReport('docs/API_GENERATION_REPORT.md');
    
    console.log('\n✅ API文档生成完成');
    console.log(`   Swagger文档: ${swaggerPath}`);
    console.log(`   生成报告: ${reportPath}`);
  } catch (error) {
    console.error('❌ API文档生成失败:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = SwaggerGenerator;