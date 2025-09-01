import React, { useState, useRef } from 'react';
import { 
  Menu,
  Users, 
  MessageSquare, 
  Plus, 
  LogOut,
  BarChart3,
  Settings,
  Rocket,
  Target,
  Calendar,
  DollarSign,
  Sparkles
} from 'lucide-react';
import BrandrLogo from './BrandrLogo';
import CampaignCreationFlow from './CampaignCreationFlow';
import CampaignDetailsModal from './CampaignDetailsModal';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  console.log('Dashboard component rendering');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCampaignBuilder, setShowCampaignBuilder] = useState(false);
  const [showCampaignCreationFlow, setShowCampaignCreationFlow] = useState(false);
  const [showCampaignDetails, setShowCampaignDetails] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [showCampaignTypes, setShowCampaignTypes] = useState(false);
  const [selectedCampaignType, setSelectedCampaignType] = useState<string>('');
  const [showCampaignWizard, setShowCampaignWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [campaignBudget, setCampaignBudget] = useState(5000);
  const [brandDnaData, setBrandDnaData] = useState({
    websiteUrl: '',
    isAnalyzing: false,
    analysis: null as any
  });
  const [campaignAnswers, setCampaignAnswers] = useState<Record<string, string>>({});
  const [chatStep, setChatStep] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [activeCampaigns, setActiveCampaigns] = useState<any[]>([
    {
      id: 'test-1',
      title: 'Test Campaign',
      status: 'active',
      budget: '$5K - $10K',
      goal: 'Increase brand awareness',
      creators: 'Fitness & Wellness',
      platforms: 'Instagram',
      expectedReach: '45K - 120K',
      expectedEngagement: '3.2% - 4.8%',
      expectedClicks: '1.2K - 3.5K'
    }
  ]);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'campaigns', label: 'Active Campaigns', icon: Rocket },
    { id: 'brand-dna', label: 'Brand DNA', icon: Target },
    { id: 'influencers', label: 'Influencers', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const campaignQuestions = [
    {
      key: 'goal',
      prompt: "What's the main goal of this campaign? (e.g., sales, awareness, traffic)"
    },
    {
      key: 'creators',
      prompt: "What kind of creators do you picture running this? (e.g., fitness, fashion, tech)"
    },
    {
      key: 'platforms',
      prompt: "Which platform(s) should they post on? (e.g., TikTok, Instagram, YouTube)"
    },
    {
      key: 'audience',
      prompt: "Who are you hoping to reach? Describe your ideal audience."
    },
    {
      key: 'budget',
      prompt: "What budget do you have in mind for this campaign?"
    },
    {
      key: 'dates',
      prompt: "When do you want the campaign to start and finish?"
    },
    {
      key: 'guidelines',
      prompt: "Do you have any brand guidelines or specific messaging you want the creators to follow?"
    }
  ];

  const openCampaignBuilder = () => {
    console.log('Create Campaign button clicked');
    setShowCampaignTypes(true);
  };

  const handleCampaignCreated = (campaign: any) => {
    console.log('Campaign created:', campaign);
    setActiveCampaigns(prev => {
      const newCampaigns = [...prev, campaign];
      console.log('Updated campaigns:', newCampaigns);
      return newCampaigns;
    });
  };

  const handleCampaignClick = (campaign: any) => {
    console.log('Campaign clicked:', campaign);
    setSelectedCampaign(campaign);
    setShowCampaignDetails(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setAttachments(prev => [...prev, ...Array.from(files)]);
      Array.from(files).forEach(file => {
        // This part of the logic is no longer needed for the chatbot,
        // but keeping it as it might be reused or for future context.
        // setChatMessages(msgs => [
        //   ...msgs,
        //   { id: `file-${Date.now()}-${file.name}`, sender: 'user', text: file.name, type: 'attachment', file }
        // ]);
      });
    }
    if (chatInputRef.current) chatInputRef.current.focus();
  };

  const handlePublishCampaign = () => {
    const newCampaign = {
      id: Date.now().toString(),
      title: `${selectedCampaignType} Campaign`,
      status: 'active',
      budget: `$${campaignBudget.toLocaleString()}`,
      goal: getGoalForCampaignType(selectedCampaignType),
      creators: 'Matched Creators',
      platforms: 'Instagram, TikTok',
      expectedReach: getExpectedReach(campaignBudget),
      expectedEngagement: '3.2% - 4.8%',
      expectedClicks: getExpectedClicks(campaignBudget)
    };
    
    setActiveCampaigns(prev => [...prev, newCampaign]);
    setShowCampaignWizard(false);
    setShowCampaignTypes(false);
    setWizardStep(1);
    setActiveTab('campaigns');
  };

  const getGoalForCampaignType = (type: string) => {
    switch (type) {
      case 'Clipping': return 'Content repurposing';
      case 'Retranscription': return 'Scripted reviews';
      case 'Act Review': return 'Product reviews';
      case 'Store Visit': return 'In-store content';
      default: return 'Brand awareness';
    }
  };

  const getExpectedReach = (budget: number) => {
    const min = Math.round(budget * 8);
    const max = Math.round(budget * 15);
    return `${formatNumber(min)} - ${formatNumber(max)}`;
  };

  const getExpectedClicks = (budget: number) => {
    const min = Math.round(budget * 0.8);
    const max = Math.round(budget * 2.5);
    return `${formatNumber(min)} - ${formatNumber(max)}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const handleCampaignTypeSelect = (type: string) => {
    setSelectedCampaignType(type);
    setShowCampaignTypes(false);
    setShowCampaignWizard(true);
  };

  const handleBrandDnaAnalysis = async () => {
    if (!brandDnaData.websiteUrl.trim()) return;
    
    setBrandDnaData(prev => ({ ...prev, isAnalyzing: true }));
    
    // Simulate AI analysis
    setTimeout(() => {
      setBrandDnaData(prev => ({
        ...prev,
        isAnalyzing: false,
        analysis: {
          niche: 'B2B SaaS & Creator Marketing',
          targetMarket: 'Startup founders and marketing teams (25-45 years old)',
          insights: [
            'Focus on ROI-driven messaging',
            'Emphasize authentic partnerships over traditional advertising',
            'Target tech-savvy entrepreneurs who value data-driven decisions',
            'Highlight time-saving and efficiency benefits'
          ]
        }
      }));
    }, 2000);
  };

  const getExpectedMetrics = () => {
    const budget = parseFloat(campaignAnswers.budget?.replace(/[^\d.]/g, '') || '0');
    const platforms = (campaignAnswers.platforms || '').toLowerCase();
    let reach = budget * 100; // Base calculation
    let engagementRate = 2.5; // Base rate
    
    if (platforms.includes('instagram')) engagementRate = 3.2;
    if (platforms.includes('tiktok')) engagementRate = 4.1;
    if (platforms.includes('youtube')) engagementRate = 2.8;
    
    return {
      reach: Math.round(reach),
      engagementRate: engagementRate.toFixed(1) + '%',
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-gray-900 shadow-sm border-r border-gray-700 transition-all duration-300`}>
        <div className="p-4">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-800 transition-colors mb-4"
          >
            <Menu className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="p-6">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-5'}`}>
            {sidebarCollapsed ? (
              <BrandrLogo size="md" />
            ) : (
              <BrandrLogo size="lg" />
            )}
          </div>
        </div>
        
        <nav className="px-4 pb-4">
          {sidebarItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 rounded-xl mb-1 transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {!sidebarCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={onLogout}
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-colors`}
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && (
              <span className="font-medium">Sign Out</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white/40 backdrop-blur-sm border-b border-gray-200/30 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'campaigns' && 'Active Campaigns'}
                {activeTab === 'brand-dna' && 'Brand DNA'}
                {activeTab === 'influencers' && 'Influencers'}
                {activeTab === 'messages' && 'Messages'}
                {activeTab === 'settings' && 'Settings'}
              </h1>
              <p className="text-gray-600 mt-1">
                {activeTab === 'dashboard' && 'Create and manage your influencer campaigns'}
                {activeTab === 'campaigns' && 'Track your active campaigns and performance'}
                {activeTab === 'brand-dna' && 'Analyze your brand identity for better campaign targeting'}
                {activeTab === 'influencers' && 'Connect with creators for your campaigns'}
                {activeTab === 'messages' && 'Communicate with your creators'}
                {activeTab === 'settings' && 'Account and notification preferences'}
              </p>
            </div>
            {activeTab === 'dashboard' && (
              <button 
                onClick={openCampaignBuilder}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Campaign</span>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Campaign Creation CTA */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <div className="flex items-center justify-between">
                  <div className="max-w-md">
                    <h2 className="text-3xl font-bold mb-4">Ready to launch your campaign?</h2>
                    <p className="text-blue-100 mb-6">
                      Our AI assistant will help you create the perfect campaign in minutes. 
                      Just answer a few questions and we'll match you with the right creators.
                    </p>
                    <button 
                      onClick={openCampaignBuilder}
                      className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-3"
                    >
                      <Sparkles className="w-5 h-5" />
                      <span>Start Creating</span>
                    </button>
                  </div>
                  <div className="hidden lg:block">
                    <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                      <Rocket className="w-16 h-16 text-white/80" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm cursor-pointer hover:bg-blue-50 transition"
                  onClick={() => setActiveTab('campaigns')}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Active Campaigns</h3>
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-2">3</p>
                  <p className="text-sm text-emerald-600">+1 from last week</p>
                </div>
                
                <div
                  className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm cursor-pointer hover:bg-blue-50 transition"
                  onClick={() => setActiveTab('campaigns')}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Total Reach</h3>
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-2">124.5K</p>
                  <p className="text-sm text-emerald-600">+12% from last month</p>
                </div>
                
                <div
                  className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm cursor-pointer hover:bg-blue-50 transition"
                  onClick={() => setActiveTab('campaigns')}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Engagement Rate</h3>
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-2">3.7%</p>
                  <p className="text-sm text-emerald-600">+0.5% from last month</p>
                </div>
              </div>

              {/* Recent Activity */}
              {/* The Recent Activity section is removed as per the edit hint. */}
            </div>
          )}

          {activeTab === 'campaigns' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Campaigns</h3>
                {activeCampaigns.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Rocket className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-4">No campaigns yet</p>
                    <button
                      onClick={openCampaignBuilder}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Create Your First Campaign
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeCampaigns.map((campaign) => (
                      <div 
                        key={campaign.id} 
                        className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                          campaign.status === 'Draft'
                            ? 'bg-yellow-50 border-yellow-200 hover:border-yellow-300 hover:shadow-md opacity-80'
                            : 'bg-gray-50 border-gray-200 hover:border-blue-300 hover:shadow-md'
                        }`}
                        onClick={() => handleCampaignClick(campaign)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">{campaign.title}</h4>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            campaign.status === 'Draft' 
                              ? 'bg-yellow-100 text-yellow-700' 
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {campaign.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Budget</p>
                            <p className="font-medium text-gray-900">{campaign.budget}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Goal</p>
                            <p className="font-medium text-gray-900">{campaign.goal}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Expected Reach</p>
                            <p className="font-medium text-gray-900">{campaign.expectedReach}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Expected Engagement</p>
                            <p className="font-medium text-gray-900">{campaign.expectedEngagement}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'brand-dna' && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Analyze Your Brand DNA</h3>
                <p className="text-gray-600 mb-8">Enter your website URL and our AI will analyze your brand identity to help create better-targeted campaigns.</p>
                
                <div className="max-w-md">
                  <div className="flex space-x-4">
                    <input
                      type="url"
                      value={brandDnaData.websiteUrl}
                      onChange={(e) => setBrandDnaData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                      placeholder="https://yourwebsite.com"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={brandDnaData.isAnalyzing}
                    />
                    <button
                      onClick={handleBrandDnaAnalysis}
                      disabled={!brandDnaData.websiteUrl.trim() || brandDnaData.isAnalyzing}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {brandDnaData.isAnalyzing ? 'Analyzing...' : 'Analyze'}
                    </button>
                  </div>
                </div>

                {brandDnaData.isAnalyzing && (
                  <div className="mt-8 text-center">
                    <div className="inline-flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-600">Analyzing your brand identity...</span>
                    </div>
                  </div>
                )}

                {brandDnaData.analysis && (
                  <div className="mt-8 space-y-6">
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <h4 className="text-lg font-semibold text-blue-900 mb-4">Brand Analysis Results</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium text-blue-800 mb-2">Your Niche</h5>
                          <p className="text-blue-700">{brandDnaData.analysis.niche}</p>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-blue-800 mb-2">Target Market</h5>
                          <p className="text-blue-700">{brandDnaData.analysis.targetMarket}</p>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-blue-800 mb-2">Campaign Targeting Insights</h5>
                          <ul className="space-y-2">
                            {brandDnaData.analysis.insights.map((insight: string, index: number) => (
                              <li key={index} className="flex items-start space-x-2">
                                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <span className="text-blue-700 text-sm">{insight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'influencers' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Matched Creators</h3>
              <p className="text-gray-600">Creators will appear here once you create a campaign.</p>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Messages</h3>
              <p className="text-gray-600">Messages from creators will appear here once campaigns are active.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
              <p className="text-gray-600">Account settings and preferences will be available here.</p>
            </div>
          )}
        </div>
      </div>



      {/* Campaign Summary Modal */}
      {showSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[80vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Campaign Summary</h2>
              <p className="text-gray-600 mt-1">Review your campaign before publishing</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {campaignQuestions.map(q => (
                <div key={q.key} className="border-b border-gray-100 pb-4">
                  <div className="text-gray-500 text-sm mb-1">{q.prompt}</div>
                  <div className="text-gray-900 font-medium">{campaignAnswers[q.key] || 'Not specified'}</div>
                </div>
              ))}
              
              {attachments.length > 0 && (
                <div className="mt-6">
                  <div className="text-gray-500 text-sm mb-2">Attached Content</div>
                  <ul className="space-y-2">
                    {attachments.map((file, i) => (
                      <li key={i} className="text-blue-600 text-sm">{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <div className="font-semibold text-blue-900 mb-2">Expected Metrics</div>
                <div className="text-sm text-blue-800">
                  <div>Estimated Reach: {getExpectedMetrics().reach.toLocaleString()} impressions</div>
                  <div>Estimated Engagement Rate: {getExpectedMetrics().engagementRate}</div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200">
              <button
                className="w-full px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition-all duration-200"
                onClick={handlePublishCampaign}
              >
                Publish Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Type Selection Modal */}
      {showCampaignTypes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Choose Campaign Type</h2>
                <p className="text-gray-600 mt-1">Select the type of campaign you want to create</p>
              </div>
              <button
                onClick={() => setShowCampaignTypes(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <button
                onClick={() => handleCampaignTypeSelect('Clipping')}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left group"
              >
                <div className="text-4xl mb-4">🎬</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">Clipping</h3>
                <p className="text-gray-600 text-sm">Repurpose existing content into engaging clips and highlights</p>
              </button>
              
              <button
                onClick={() => handleCampaignTypeSelect('Retranscription')}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left group"
              >
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">Retranscription</h3>
                <p className="text-gray-600 text-sm">Scripted creator reviews with detailed talking points</p>
              </button>
              
              <button
                onClick={() => handleCampaignTypeSelect('Act Review')}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left group"
              >
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">Act Review</h3>
                <p className="text-gray-600 text-sm">Send products to creators for authentic unboxing and reviews</p>
              </button>
              
              <button
                onClick={() => handleCampaignTypeSelect('Store Visit')}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left group"
              >
                <div className="text-4xl mb-4">🏬</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">Store Visit</h3>
                <p className="text-gray-600 text-sm">Creators visit your physical location to film content</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Creation Wizard */}
      {showCampaignWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedCampaignType} Campaign</h2>
                <p className="text-gray-600 mt-1">Step {wizardStep} of 3</p>
              </div>
              <button
                onClick={() => {
                  setShowCampaignWizard(false);
                  setWizardStep(1);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(wizardStep / 3) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {wizardStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">What's your budget?</h3>
                  <p className="text-gray-600 mb-6">Set your campaign budget to get matched with the right creators</p>
                  
                  <div className="space-y-4">
                    <div className="text-center">
                      <span className="text-3xl font-bold text-blue-600">${campaignBudget.toLocaleString()}</span>
                    </div>
                    
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={((Math.log(campaignBudget) - Math.log(500)) / (Math.log(50000) - Math.log(500))) * 100}
                      onChange={(e) => {
                        const percentage = parseInt(e.target.value);
                        const min = Math.log(500);
                        const max = Math.log(50000);
                        const scale = (max - min) / 100;
                        const budget = Math.round(Math.exp(min + scale * percentage));
                        setCampaignBudget(budget);
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((Math.log(campaignBudget) - Math.log(500)) / (Math.log(50000) - Math.log(500))) * 100}%, #e5e7eb ${((Math.log(campaignBudget) - Math.log(500)) / (Math.log(50000) - Math.log(500))) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>$500</span>
                      <span>$50,000</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mt-6">
                    {[1000, 5000, 10000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setCampaignBudget(amount)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          campaignBudget === amount
                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        ${amount.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={() => setWizardStep(2)}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            )}
            
            {wizardStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Campaign Preview</h3>
                  <p className="text-gray-600 mb-6">Here's what your {selectedCampaignType.toLowerCase()} campaign will look like</p>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                    <h4 className="text-lg font-semibold text-blue-900 mb-4">Expected Results</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{getExpectedReach(campaignBudget)}</div>
                        <div className="text-sm text-blue-700">Expected Reach</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">3.2% - 4.8%</div>
                        <div className="text-sm text-purple-700">Engagement Rate</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{getExpectedClicks(campaignBudget)}</div>
                        <div className="text-sm text-green-700">Expected Clicks</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Campaign Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Campaign Type:</span>
                        <span className="text-gray-900">{selectedCampaignType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Budget:</span>
                        <span className="text-gray-900">${campaignBudget.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Goal:</span>
                        <span className="text-gray-900">{getGoalForCampaignType(selectedCampaignType)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estimated Creators:</span>
                        <span className="text-gray-900">{Math.ceil(campaignBudget / 1000)} - {Math.ceil(campaignBudget / 500)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => setWizardStep(1)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setWizardStep(3)}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
            
            {wizardStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to Launch!</h3>
                  <p className="text-gray-600 mb-6">Your {selectedCampaignType.toLowerCase()} campaign is ready to go live and start matching with creators.</p>
                  
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Campaign Summary</h4>
                    <div className="text-left space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="text-gray-900">{selectedCampaignType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Budget:</span>
                        <span className="text-gray-900">${campaignBudget.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expected Reach:</span>
                        <span className="text-gray-900">{getExpectedReach(campaignBudget)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => setWizardStep(2)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePublishCampaign}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Launch Campaign</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Campaign Creation Flow */}
      {showCampaignCreationFlow && (
        <CampaignCreationFlow
          onClose={() => setShowCampaignCreationFlow(false)}
          onCampaignCreated={handleCampaignCreated}
        />
      )}

      {/* Campaign Details Modal */}
      {showCampaignDetails && selectedCampaign && (
        <CampaignDetailsModal
          campaign={selectedCampaign}
          onClose={() => {
            setShowCampaignDetails(false);
            setSelectedCampaign(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;