import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Row, Col, Typography, Space, Rate, Tag, Divider } from 'antd';
import { ArrowRightOutlined, BarChartOutlined } from '@ant-design/icons';
import { FundProduct } from '@/utils/api';
import './HomePage.css';

const { Title, Text, Paragraph } = Typography;

const HomePage: React.FC = () => {
  const [hotFunds, setHotFunds] = React.useState<FundProduct[]>([]);
  const [loading, setLoading] = React.useState(true);

  // 初始化加载热门基金数据
  useEffect(() => {
    const loadFundData = async () => {
      setLoading(true);
      try {
        // 模拟数据（实际项目替换为API请求）
        setHotFunds([
          { id: '1', name: '聚财日斗T8基金', annualReturn: '12.5%', riskLevel: 'medium', period: '6个月', scale: '2.8亿', rate: 4.8 },
          { id: '2', name: '聚财星月P6基金', annualReturn: '8.9%', riskLevel: 'low', period: '12个月', scale: '5.3亿', rate: 4.6 },
          { id: '3', name: '聚财风云Q9基金', annualReturn: '15.2%', riskLevel: 'high', period: '3个月', scale: '1.9亿', rate: 4.9 },
          { id: '4', name: '聚财华耀R3基金', annualReturn: '10.7%', riskLevel: 'medium', period: '9个月', scale: '3.5亿', rate: 4.7 },
        ]);
      } catch (error) {
        console.error('加载热门基金失败:', error);
        // 模拟数据（实际项目替换为API请求）
        setHotFunds([
          { id: '1', name: '聚财日斗T8基金', annualReturn: '12.5%', riskLevel: 'medium', period: '6个月', scale: '2.8亿', rate: 4.8 },
          { id: '2', name: '聚财星月P6基金', annualReturn: '8.9%', riskLevel: 'low', period: '12个月', scale: '5.3亿', rate: 4.6 },
          { id: '3', name: '聚财风云Q9基金', annualReturn: '15.2%', riskLevel: 'high', period: '3个月', scale: '1.9亿', rate: 4.9 },
          { id: '4', name: '聚财华耀R3基金', annualReturn: '10.7%', riskLevel: 'medium', period: '9个月', scale: '3.5亿', rate: 4.7 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadFundData();
  }, []);

  // 风险等级标签渲染
  const renderRiskTag = (level: string) => {
    switch (level) {
      case 'low':
        return <Tag color="green">低风险</Tag>;
      case 'medium':
        return <Tag color="orange">中风险</Tag>;
      case 'high':
        return <Tag color="red">高风险</Tag>;
      default:
        return <Tag color="gray">未知风险</Tag>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100">
      {/* 顶部Banner区 */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-teal-500 text-white">
        {/* 动态背景装饰 */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-1/4 w-20 h-20 rounded-full bg-white/30 animate-blob"></div>
          <div className="absolute bottom-10 right-1/3 w-32 h-32 rounded-full bg-white/20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-white/25 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} md={14}>
              <Title level={1} className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                聚财众发-基金交易平台
              </Title>
              <Title level={2} className="text-xl md:text-2xl font-light mb-6 text-white/90">
                智能投资 · 财富增值
              </Title>
              <Paragraph className="text-lg md:text-xl mb-8 max-w-2xl text-white/80">
                专业的基金交易平台，为您提供智能化投资解决方案，让财富管理更简单、更高效
              </Paragraph>
              <Space size="large">
                <Button 
                  type="primary" 
                  size="large" 
                  className="bg-white text-blue-600 hover:bg-white/90 rounded-full px-8 shadow-lg"
                >
                  立即交易 <ArrowRightOutlined />
                </Button>
                <Button 
                  size="large" 
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-full px-8"
                  href="/funds"
                >
                  浏览基金
                </Button>
              </Space>
            </Col>
            <Col xs={24} md={10} className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                <BarChartOutlined className="text-8xl text-white/80 mb-4" />
                <Text className="text-lg">实时行情监控 · 智能投顾分析 · 安全交易保障</Text>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* 核心优势区 */}
      <div className="container mx-auto px-4 py-16">
        <Title level={2} className="text-2xl md:text-3xl font-bold text-center mb-12">平台核心优势</Title>
        <Row gutter={[32, 32]} justify="center">
          <Col xs={24} sm={12} md={8}>
            <Card className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-none shadow-lg rounded-xl overflow-hidden">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChartOutlined className="text-2xl text-blue-600 dark:text-blue-400" />
                </div>
                <Title level={3} className="text-xl font-bold mb-2">AI智能分析</Title>
                <Paragraph className="text-slate-600 dark:text-slate-300">
                  基于大数据与AI算法，提供精准投资建议，把握市场趋势
                </Paragraph>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-none shadow-lg rounded-xl overflow-hidden">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChartOutlined className="text-2xl text-teal-600 dark:text-teal-400" />
                </div>
                <Title level={3} className="text-xl font-bold mb-2">安全可靠</Title>
                <Paragraph className="text-slate-600 dark:text-slate-300">
                  多重加密技术保障，资金安全无忧，合规运营值得信赖
                </Paragraph>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-none shadow-lg rounded-xl overflow-hidden">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChartOutlined className="text-2xl text-purple-600 dark:text-purple-400" />
                </div>
                <Title level={3} className="text-xl font-bold mb-2">高效便捷</Title>
                <Paragraph className="text-slate-600 dark:text-slate-300">
                  一键投资，智能调仓，操作简单，新手也能轻松上手
                </Paragraph>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* 热门基金区 */}
      <div className="bg-slate-100 dark:bg-slate-800 py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <Title level={2} className="text-2xl md:text-3xl font-bold">热门基金产品</Title>
            <Button 
              type="text" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              href="/funds"
            >
              查看全部 <ArrowRightOutlined />
            </Button>
          </div>

          <Row gutter={[24, 24]}>
            {hotFunds.map((fund) => (
              <Col xs={24} sm={12} md={6} key={fund.id}>
                <Card 
                  className="h-full bg-white dark:bg-slate-700 border-none shadow-md rounded-xl hover:shadow-xl transition-shadow duration-300"
                  hoverable
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <Title level={4} className="font-bold text-lg mb-0">{fund.name}</Title>
                      {renderRiskTag(fund.riskLevel)}
                    </div>
                    <div className="mb-4">
                      <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">{fund.annualReturn}</Text>
                      <Text className="text-slate-500 dark:text-slate-400 ml-2">年化收益率</Text>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300 mb-4">
                      <div>投资周期: {fund.period}</div>
                      <div>基金规模: {fund.scale}</div>
                    </div>
                    <div className="flex items-center mb-4">
                      <Rate value={fund.rate} disabled count={5} />
                      <Text className="ml-2 text-sm text-slate-500 dark:text-slate-400">{fund.rate}分</Text>
                    </div>
                    <Button 
                      type="primary" 
                      className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg"
                      href={`/funds/${fund.id}`}
                    >
                      立即投资
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* 交易类型区 */}
      <div className="container mx-auto px-4 py-16">
        <Title level={2} className="text-2xl md:text-3xl font-bold text-center mb-12">多元交易选择</Title>
        <Row gutter={[32, 32]}>
          <Col xs={24} md={8}>
            <Card 
              className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-none shadow-lg rounded-xl overflow-hidden"
              actions={[
                <Button 
                  type="primary" 
                  size="middle" 
                  className="rounded-full"
                  href="/trading/contract/shanghai"
                >
                  上海市场交易
                </Button>,
                <Button 
                  size="middle" 
                  className="rounded-full"
                  href="/trading/contract/hongkong"
                >
                  香港市场交易
                </Button>
              ]}
            >
              <div className="p-6">
                <Title level={3} className="text-xl font-bold mb-3">合约交易</Title>
                <Paragraph className="text-slate-600 dark:text-slate-300 mb-4">
                  支持上海、香港双市场合约交易，1x-20x灵活杠杆，满足不同风险偏好
                </Paragraph>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Tag>BTC/USDT</Tag>
                  <Tag>ETH/USDT</Tag>
                  <Tag>永续合约</Tag>
                  <Tag>灵活杠杆</Tag>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card 
              className="h-full bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-900/30 dark:to-green-900/30 border-none shadow-lg rounded-xl overflow-hidden"
              actions={[
                <Button 
                  type="primary" 
                  size="middle" 
                  className="rounded-full bg-teal-600 hover:bg-teal-700"
                  href="/trading/option/1min"
                >
                  1分钟期权
                </Button>,
                <Button 
                  size="middle" 
                  className="rounded-full"
                  href="/trading/option/5min"
                >
                  5分钟期权
                </Button>,
                <Button 
                  size="middle" 
                  className="rounded-full"
                  href="/trading/option/10min"
                >
                  10分钟期权
                </Button>
              ]}
            >
              <div className="p-6">
                <Title level={3} className="text-xl font-bold mb-3">二元期权</Title>
                <Paragraph className="text-slate-600 dark:text-slate-300 mb-4">
                  1分钟、5分钟、10分钟多周期选择，简单预测涨跌，高收益率回报
                </Paragraph>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Tag>简单操作</Tag>
                  <Tag>高收益率</Tag>
                  <Tag>多周期</Tag>
                  <Tag>快速收益</Tag>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card 
              className="h-full bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border-none shadow-lg rounded-xl overflow-hidden"
              actions={[
                <Button 
                  type="primary" 
                  size="middle" 
                  className="rounded-full bg-purple-600 hover:bg-purple-700"
                  href="/funds"
                >
                  浏览全部基金
                </Button>
              ]}
            >
              <div className="p-6">
                <Title level={3} className="text-xl font-bold mb-3">私募基金</Title>
                <Paragraph className="text-slate-600 dark:text-slate-300 mb-4">
                  专业机构管理，低中高风险全覆盖，为您提供稳健的财富增值方案
                </Paragraph>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Tag>专业管理</Tag>
                  <Tag>风险分级</Tag>
                  <Tag>稳健增值</Tag>
                  <Tag>机构背书</Tag>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* 底部CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Title level={2} className="text-2xl md:text-3xl font-bold mb-4">开启您的智能投资之旅</Title>
          <Paragraph className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
            加入聚财众发，体验专业、安全、高效的基金交易平台
          </Paragraph>
          <Button 
            type="primary" 
            size="large" 
            className="bg-white text-blue-600 hover:bg-white/90 rounded-full px-8 shadow-lg text-lg"
            href="/register"
          >
            立即注册 <ArrowRightOutlined />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;