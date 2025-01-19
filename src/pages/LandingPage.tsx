import { Box, Card, Typography, Button, styled, InputBase, Snackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import livingroomIcon from '../assets/livingroom.svg';
import pointingCursor from '../assets/pointer.png';
import mobileLine from '../assets/mobile_line.svg';
import logoImage from '../assets/logo.svg';
import enterIcon from '../assets/uil_enter.svg';
import { useState, useEffect, useRef } from 'react';
import lineSvg from '../assets/line.svg';
import { RootState } from '../store';
import { hideToast, showToast } from '../store/slices/toastSlice';
import { setRem, pxToRem } from '../utils/rem';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getSkyboxStatus, GetSkyboxResponse } from '../services/api';
import LoadingState from '../components/LoadingState';

const PageContainer = styled(Box)(({ theme }) => ({
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  backgroundColor: 'rgba(0, 0, 0, 0.25)',
  position: 'relative',
  zIndex: 1,

  [theme.breakpoints.down('sm')]: {
    height: '100vh',
    justifyContent: 'flex-start',
    gap: pxToRem(30),
    padding: `0 ${pxToRem(20)}`,
  }
}));

const Header = styled(Box)(({ theme }) => ({
  height: '6.44rem',
  width: '100%',
  padding: '1.875rem 2.5rem',
  display: 'flex',
  alignItems: 'center',

  [theme.breakpoints.down('sm')]: {
    height: 'auto',
    padding: 0,
    marginTop: pxToRem(20), // 给顶部一些间距
  }
}));

const Logo = styled('img')(({ theme }) => ({
  width: pxToRem(100),
  height: pxToRem(35),

  [theme.breakpoints.down('sm')]: {
    width: pxToRem(68.57),
    height: pxToRem(24),
  }
}));

const Content = styled(Box)(({ theme }) => ({
  height: '37.875rem',
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '2rem',
  overflow: 'hidden',
  paddingLeft: '3.75rem',
  transition: 'padding-left 0.3s ease',

  '@media (min-width: 1440px)': {
    paddingLeft: 'calc(3.75rem + ((100vw - 1440px) / 480) * 140)',
  },

  '@media (min-width: 1920px)': {
    paddingLeft: '12.5rem',
  },

  [theme.breakpoints.down('sm')]: {
    padding: 0,
    height: 'auto',
    gap: '2rem',
  }
}));

const ContentInner = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '100%',
});

const BackgroundContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '19.5rem',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '300vw',
  height: '8.063rem',
  display: 'flex',
  justifyContent: 'center',

  [theme.breakpoints.down('sm')]: {
    display: 'none', // 在移动端隐藏原来的背景
  }
}));

const MobileBackground = styled(Box)(({ }) => ({
    display: 'block',
    position: 'absolute',
    top: pxToRem(316),
    left: 0,
    width: pxToRem(390),
    height: pxToRem(86),
    zIndex: 0,
    pointerEvents: 'none',
  
}));

const BackgroundLine = styled('img')({
  height: '8.063rem',
  transform: 'translateX(22.25rem)',
});

const BackgroundLine2 = styled('img')({
  height: '8.063rem',
});

const BackgroundLine3 = styled('img')({
  height: '8.063rem',
  transform: 'translateX(-22.25rem)',
});

const CardsContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '8.938rem',
  left: '37.938rem',
  display: 'flex',
  gap: '1.563rem',
  zIndex: 1,

  [theme.breakpoints.down('sm')]: {
    position: 'relative',
    top: 'auto',
    left: 'auto',
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)', // 两列布局
    gap: pxToRem(16), // 卡片间距16px
    order: -1, // 移到IntegrationText前面
  }
}));

const Footer = styled(Box)(({ theme }) => ({
  height: pxToRem(143),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  [theme.breakpoints.down('sm')]: {
    flex: 1,
    minHeight: 'auto',
    padding: 0,
  }
}));

const InputContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'focused'
})<{ focused: boolean }>(({ focused, theme }) => ({
  width: pxToRem(874),
  height: pxToRem(63),
  backgroundColor: 'rgba(0, 0, 0, 0.3)', // 修改为30%透明度
  borderRadius: pxToRem(8),
  padding: pxToRem(15) + ' ' + pxToRem(25),
  display: 'flex',
  alignItems: 'center',
  gap: pxToRem(14),
  border: focused ? '1px solid #C9ACFF' : '1px solid rgba(0, 0, 0, 0.3)', // 边框也使用相同透明度
  transition: 'border 0.2s ease',

  [theme.breakpoints.down('sm')]: {
    width: '100%',
    height: pxToRem(48),
    padding: `${pxToRem(12)} ${pxToRem(16)}`,
    gap: pxToRem(8),
  }
}));

const StyledInput = styled(InputBase)({
  width: pxToRem(874),
  height: pxToRem(63),
  color: '#D6C0FF',
  fontSize: pxToRem(14),
  lineHeight: '140%',
  '& .MuiInputBase-input': {
    padding: 0,
  },
});

const GenerateButton = styled(Button, {
  shouldForwardProp: (prop) => !['hasContent', 'disabled'].includes(prop as string)
})<{ hasContent: boolean; disabled?: boolean }>(({ hasContent, disabled, theme }) => ({
  width: pxToRem(141),
  height: pxToRem(35),
  borderRadius: pxToRem(4),
  backgroundColor: disabled 
    ? 'rgba(170, 171, 180, 0.1)' 
    : (hasContent ? 'rgba(199, 255, 140, 0.1)' : 'transparent'),
  display: 'flex',
  alignItems: 'center',
  gap: pxToRem(8),
  padding: pxToRem(5) + ' ' + pxToRem(16),
  textTransform: 'none',
  opacity: disabled ? 0.5 : 1,
  '&:hover': {
    backgroundColor: disabled 
      ? 'rgba(170, 171, 180, 0.1)' 
      : (hasContent ? 'rgba(199, 255, 140, 0.2)' : 'transparent'),
  },

  [theme.breakpoints.down('sm')]: {
    width: 'auto',
    padding: 0,
    minWidth: 'unset',
  }
}));

const EnterIcon = styled('img')(({ theme }) => ({
  width: pxToRem(24),
  height: pxToRem(24),
  marginLeft: pxToRem(16),

  [theme.breakpoints.down('sm')]: {
    marginLeft: 0,
  }
}));

const ButtonText = styled('span')(({ theme }) => ({
  fontSize: pxToRem(18),
  lineHeight: '140%',
  color: '#C7FF8C',
  fontWeight: 400,
  textTransform: 'none',
  marginRight: pxToRem(16),

  [theme.breakpoints.down('sm')]: {
    display: 'none', // 在移动端隐藏文本
  }
}));

const AgentCard = styled(Card)(({ theme }) => ({
  width: '20.75rem',
  height: '22.688rem',
  padding: '1.25rem',
  borderRadius: '0.25rem',
  backgroundColor: '#A276FF',
  backgroundImage: `linear-gradient(135deg, #9a6bff 25%, transparent 25%), 
                   linear-gradient(225deg, #9a6bff 25%, transparent 25%), 
                   linear-gradient(45deg, #9a6bff 25%, transparent 25%), 
                   linear-gradient(315deg, #9a6bff 25%, #A276FF 25%)`,
  backgroundPosition: `${pxToRem(40)} 0, ${pxToRem(40)} 0, 0 0, 0 0`,
  backgroundSize: `${pxToRem(80)} ${pxToRem(80)}`,
  backgroundRepeat: 'repeat',
  cursor: `url(${pointingCursor}), pointer`,
  display: 'flex',
  flexDirection: 'column',
  gap: 0,

  [theme.breakpoints.down('sm')]: {
    width: pxToRem(167),
    height: pxToRem(196),
    padding: pxToRem(10),
    backgroundSize: `${pxToRem(40)} ${pxToRem(40)}`, // 缩小背景图案
    backgroundPosition: `${pxToRem(20)} 0, ${pxToRem(20)} 0, 0 0, 0 0`,
  }
}));

const AgentImage = styled('img')(({ theme }) => ({
  width: pxToRem(292),
  height: pxToRem(200),
  borderRadius: pxToRem(4),
  objectFit: 'cover',
  display: 'block',

  [theme.breakpoints.down('sm')]: {
    width: pxToRem(147),
    height: pxToRem(101),
  }
}));

const TextContent = styled(Box)(({ theme }) => ({
  width: pxToRem(292),
  height: pxToRem(73),
  padding: `${pxToRem(10)} 0`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',

  [theme.breakpoints.down('sm')]: {
    width: pxToRem(147),
    height: pxToRem(40),
    gap: pxToRem(2),
    padding: `${pxToRem(8)} 0`,
  }
}));

const AgentName = styled(Typography)(({ theme }) => ({
  fontSize: pxToRem(30),
  lineHeight: pxToRem(24),
  fontWeight: 'bold',
  color: '#000000',

  [theme.breakpoints.down('sm')]: {
    fontSize: pxToRem(18),
    fontWeight: 800,
    lineHeight: pxToRem(12.1),
  }
}));

const AgentDescription = styled(Typography)(({ theme }) => ({
  fontSize: pxToRem(18),
  lineHeight: pxToRem(24),
  fontWeight: 500,
  color: '#000000',

  [theme.breakpoints.down('sm')]: {
    fontSize: pxToRem(10),
    lineHeight: pxToRem(12.1),
  }
}));

const ActionButton = styled(Button)<{ disabled?: boolean }>(({ disabled, theme }) => ({
  width: pxToRem(292),
  height: pxToRem(50),
  borderRadius: pxToRem(4),
  backgroundColor: disabled ? '#AAABB4' : '#C7FF8C',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 0,
  '&:hover': {
    backgroundColor: disabled ? '#AAABB4' : '#E5FFC9',
  },

  [theme.breakpoints.down('sm')]: {
    width: pxToRem(147),
    height: pxToRem(31),
  }
}));

const ActionText = styled(Typography)<{ disabled?: boolean }>(({ disabled, theme }) => ({
  fontSize: pxToRem(20),
  lineHeight: pxToRem(24),
  fontWeight: 'bold',
  color: disabled ? '#636071' : '#000000',

  [theme.breakpoints.down('sm')]: {
    fontSize: pxToRem(14),
    lineHeight: pxToRem(16),
  }
}));

const ActionIcon = styled('img')({
  width: pxToRem(30),
  height: pxToRem(30),
});

const agents = [
    {
      id: 'misato',
      name: 'MISATO',
      avatar: '/misato.jpg',
      address: '0xabcdef1234567890abcdef1234567890abcdef12',
      description: 'Co-Founder Of Mirae',
      action: 'CHAT',
      wallet_address: '0x900709432a8F2C7E65f90aA7CD35D0afe4eB7169',
      url: 'https://studiobeta.misato.ai/',
    },
    {
        id: '-1',
        name: 'WAITING',
        avatar: '/waiting.jpg',
        address: '0x1234567890abcdef1234567890abcdef12345678',
        description: '...',
        action: 'GENERATING',
        wallet_address: '0x1234567890abcdef1234567890abcdef12345678',
        url: 'https://www.mirae.xyz',
    }
];

const TextContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  display: 'flex',
  flexDirection: 'column',

  [theme.breakpoints.down('sm')]: {
    position: 'relative',
    width: '100%',
    padding: `${pxToRem(20)} 0`,
    gap: 0,
  }
}));

const TitleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: pxToRem(24),

  [theme.breakpoints.down('sm')]: {
    marginBottom: pxToRem(8),
  }
}));

const TitleText = styled(Typography)(({ theme }) => ({
  fontSize: pxToRem(80),
  lineHeight: '110%',
  fontWeight: 800,
  color: '#FFFFFF',

  [theme.breakpoints.down('sm')]: {
    fontSize: pxToRem(45),
    lineHeight: '110%',
  }
}));

const HighlightText = styled('span')({
  color: '#C9ACFF',
});

const DescriptionText = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: pxToRem(336),
  left: 0,
  display: 'flex',
  flexDirection: 'column',
  width: pxToRem(448),
  fontSize: pxToRem(18),
  lineHeight: '140%',
  fontWeight: 400,
  color: '#FFFFFF',
  '& span': {
    fontWeight: 400,
  },

  [theme.breakpoints.down('sm')]: {
    position: 'relative',
    top: 'auto',
    left: 'auto',
    width: '100%',
    fontSize: pxToRem(14),
    lineHeight: '140%',
  }
}));

const IntegrationText = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  left: pxToRem(607),
  top: pxToRem(10),
  width: pxToRem(574),
  fontSize: pxToRem(18),
  lineHeight: '140%',
  fontWeight: 400,
  color: '#FFFFFF',

  [theme.breakpoints.down('sm')]: {
    position: 'relative',
    left: 'auto',
    top: 'auto',
    marginTop: pxToRem(40),
    width: '100%',
    // 不居中，靠左
    textAlign: 'left',
    fontSize: pxToRem(14),
    lineHeight: '140%',
    order: 0,
  }
}));

const ApplyButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  left: pxToRem(607),
  top: pxToRem(71),
  width: pxToRem(276),
  height: pxToRem(40),
  borderRadius: pxToRem(4),
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  border: '1px solid #FFFFFF',
  padding: `${pxToRem(8)} 0px`,
  margin: 0,
  transition: 'all 0.2s ease',
  color: '#FFFFFF',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid #C7FF8C',
    color: '#C7FF8C',
  },

  [theme.breakpoints.down('sm')]: {
    position: 'relative',
    left: 'auto',
    top: 'auto',
    width: 'auto', // 适应内容，不需要填满
    height: 'auto',
    marginTop: pxToRem(11),
    padding: `${pxToRem(8)} ${pxToRem(12)}`,
    order: 1,
  }
}));

const ApplyButtonText = styled(Typography)(({ theme }) => ({
  fontSize: pxToRem(20),
  lineHeight: '100%',
  fontWeight: 500,
  color: 'inherit',
  textTransform: 'none',

  [theme.breakpoints.down('sm')]: {
    fontSize: pxToRem(14),
    lineHeight: '100%',
  }
}));

const UnityContainer = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: 0,
});

const UnityCanvas = styled('canvas')({
  width: '100%',
  height: '100%',
  opacity: 0,
  transition: 'opacity 1s ease',
});

const UnityFooter = styled('div')({
  display: 'none',
});

const UnityWarning = styled(Box)({
  position: 'absolute',
  left: '50%',
  top: '5%',
  transform: 'translate(-50%)',
  background: 'white',
  padding: pxToRem(10),
  display: 'none',
  zIndex: 10,
});

const STYLES = [
  'M3 Above the Clouds',
  'M3 Above the Clouds (Featured)',
  'M3 Advanced (artistic)',
  'M3 Advanced (photo/render)',
  'M3 Americana Painting',
  'M3 Anime',
  'M3 Cinematic Realism',
  'M3 Comic',
  'M3 Concept Render',
  'M3 Dark Anime Glow',
  'M3 Detailed Render',
  'M3 Digital Painting',
  'M3 Digital Painting (Featured)',
  'M3 Drone Shot',
  'M3 Dutch Masters',
  'M3 Dystopian Render',
  'M3 Elegant Maximalism',
  'M3 Elegant Maximalism (Featured)',
  'M3 Fantasy',
  'M3 French Comic',
  'M3 Grunge Pop',
  'M3 Infrared Photo',
  'M3 Ink Drawing',
  'M3 Low-Poly Render',
  'M3 Magic Realism',
  'M3 Maximalism Render',
  'M3 Neo Tokyo',
  'M3 Open World',
  'M3 Photoreal',
  'M3 Photoreal (Featured)',
  'M3 Playground',
  'M3 Playground (Featured)',
  'M3 Psychedelic Illustration',
  'M3 Psychedelic Painting',
  'M3 Radiant Painting',
  'M3 Retro Fantasy',
  'M3 Retro Fantasy (Featured)',
  'M3 Scifi Concept Art',
  'M3 Sky Dome',
  'M3 Storybook',
  'M3 Surreal Painting',
  'M3 UHD Render',
  'M3 Utopian Render',
  'M3 Vibrant Anime',
  'M3 Watercolor'
];

export default function LandingPage() {
  const [inputValue, setInputValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState<string>('');
  const [lastCreatedAt, setLastCreatedAt] = useState<string | null>(null);
  const dispatch = useDispatch();
  const toast = useSelector((state: RootState) => state.toast);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasLoadedRef = useRef(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isUnityLoading, setIsUnityLoading] = useState(true);
  const [unityInstance, setUnityInstance] = useState<any>(null);

  const handleCloseToast = () => {
    dispatch(hideToast());
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const getRandomStyle = () => {
    const randomIndex = Math.floor(Math.random() * STYLES.length);
    return STYLES[randomIndex];
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleGenerate();
    }
  };

  const handleGenerate = () => {
    if (!inputValue || !unityInstance) return;
    
    const randomStyle = getRandomStyle();
    const message = `${randomStyle}|${inputValue}`;
    
    try {
      unityInstance.SendMessage('Communication', 'Create', message);
      
      // 设置当前时间为最新生成时间
      const now = new Date().toISOString();
      setLastCreatedAt(now);
      setIsInputDisabled(true);
      setInputValue(''); // 清空输入
      
      // 开始24小时倒计时
      updateRemainingTime(now);
      
      dispatch(showToast({
        message: 'Generating skybox...',
        severity: 'info'
      }));
    } catch (error) {
      console.error('Failed to send message to Unity:', error);
      dispatch(showToast({
        message: 'Failed to generate skybox',
        severity: 'error'
      }));
    }
  };

  const updateRemainingTime = (createdAt: string) => {
    const lastCreated = new Date(createdAt);
    const now = new Date();
    // const diffHours = (now.getTime() - lastCreated.getTime()) / (1000 * 60 * 60);
    
    // if (diffHours < 24) {
    //   const remainingHours = Math.floor(24 - diffHours);
    //   const remainingMinutes = Math.floor((24 - diffHours - remainingHours) * 60);
    //   setRemainingTime(`${remainingHours}h ${remainingMinutes}m`);
    //   setIsInputDisabled(true);
    // } else {
    //   setRemainingTime('');
    //   setIsInputDisabled(false);
    // }

    const diffMinutes = (now.getTime() - lastCreated.getTime()) / (1000 * 60); // 计算分钟差
  
    if (diffMinutes < 5) { // 改为5分钟
      const remainingMinutes = Math.floor(5 - diffMinutes);
      const remainingSeconds = Math.floor((5 - diffMinutes - remainingMinutes) * 60);
      setRemainingTime(`${remainingMinutes}m ${remainingSeconds}s`); // 显示分钟和秒
      setIsInputDisabled(true);
    } else {
      setRemainingTime('');
      setIsInputDisabled(false);
    }
  };

  // 同时更新本地时间显示和同步后端状态
  useEffect(() => {
    if (!lastCreatedAt) return;

    // 每分钟更新显示
    const displayTimer = setInterval(() => {
      updateRemainingTime(lastCreatedAt);
    }, 60000);

    // 每5分钟同步后端状态
    const syncTimer = setInterval(async () => {
      try {
        const response = await getSkyboxStatus();
        if (response.message === 'success' && response.data?.created_at) {
          setLastCreatedAt(response.data.created_at);
          updateRemainingTime(response.data.created_at);
        }
      } catch (error) {
        console.error('Failed to sync skybox status:', error);
      }
    }, 5 * 60 * 1000); // 5分钟

    return () => {
      clearInterval(displayTimer);
      clearInterval(syncTimer);
    };
  }, [lastCreatedAt]);

  // 初始检查状态
  useEffect(() => {
    const checkSkyboxStatus = async () => {
      try {
        const response: GetSkyboxResponse = await getSkyboxStatus();
        if (response.message === 'success' && response.data?.created_at) {
          setLastCreatedAt(response.data.created_at);
          updateRemainingTime(response.data.created_at);
        }
      } catch (error) {
        console.error('Failed to check skybox status:', error);
      }
    };

    checkSkyboxStatus();
  }, []);

  const handleSelectAgent = (agentId: string) => {
    if (agentId === '-1') return; // 如果是不可用状态，直接返回
    const selectedAgent = agents.find(agent => agent.id === agentId);
    // 打开链接
    window.open(selectedAgent?.url, '_blank');
  };

  const capitalizeWords = (text: string) => {
    return text.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const unityShowBanner = (msg: string, type: 'error' | 'warning') => {
    console.log('Unity 加载进度:', msg, type);
  };

  const handleResize = () => {
    if (canvasRef.current) {
      canvasRef.current.style.width = window.innerWidth + "px";
      canvasRef.current.style.height = window.innerHeight + "px";
    }
  };

  useEffect(() => {
    console.log('LandingPage mounted');
    const document = window.document;
    const fontSize = document.documentElement.style.fontSize;
    console.log('Font size:', fontSize);
  }, []);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const buildUrl = "/Build";
    const config = {
      dataUrl: buildUrl + "/d3dcbfc54b31c6bfc2ac5547421341d7.data.unityweb",
      frameworkUrl: buildUrl + "/886e89956cc645ec2bd4cb9056885f4b.framework.js.unityweb",
      codeUrl: buildUrl + "/799773a9ce8183130623425262512c2e.wasm.unityweb",
      streamingAssetsUrl: "StreamingAssets",
      companyName: "DefaultCompany",
      productName: "Create3DSkybox",
      productVersion: "0.1",
      showBanner: unityShowBanner,
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const script = document.createElement("script");
    script.src = buildUrl + "/9853637125e801e9aae48e78dbbdcfca.loader.js";
    script.onload = async () => {
      try {
        const instance = await window.createUnityInstance(canvasRef.current, config, (progress: number) => {
          console.log('Unity 加载进度:', progress);
          if (progress === 1) {
            setIsUnityLoading(false);
          }
        });
        
        setUnityInstance(instance); // 保存unity实例
        
        if (canvasRef.current) {
          canvasRef.current.style.opacity = '1';
        }

        instance.SendMessage('Communication', 'Init', "/studio-api");
      } catch (error) {
        console.error('Unity 加载失败:', error);
        setIsUnityLoading(false);
        unityShowBanner('Unity 加载失败', 'error');
      }
    };

    document.body.appendChild(script);

    return () => {
      window.removeEventListener('resize', handleResize);
      hasLoadedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setRem(isMobile);
    
    const handleResize = () => {
      setRem(isMobile);
      if (canvasRef.current) {
        canvasRef.current.style.width = window.innerWidth + "px";
        canvasRef.current.style.height = window.innerHeight + "px";
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <UnityContainer className="unity-desktop" id="unity-container">
        <UnityCanvas ref={canvasRef} id="unity-canvas" />
        <UnityWarning id="unity-warning" />
        <UnityFooter id="unity-footer" />
        {isUnityLoading && <LoadingState />}
      </UnityContainer>
      
      <PageContainer>
        <Header>
          <Logo src={logoImage} alt="Mavae Studio" />
        </Header>

        {isMobile && <MobileBackground>
          <img 
            src={mobileLine} 
            alt="" 
            style={{ 
              width: '100%', 
              height: '100%',
              objectFit: 'cover' 
            }} 
          />
        </MobileBackground>}
        
        <Content>
          <ContentInner>
            <TextContainer>
              <TitleContainer>
                <TitleText>A STUDIO</TitleText>
                <TitleText>COMPOSED OF</TitleText>
                <TitleText>
                  <HighlightText>AGENTS !</HighlightText>
                </TitleText>
              </TitleContainer>
              <DescriptionText>
                {capitalizeWords(
                  'Provides interfaces for interacting with agents and various tools needed for agents to complete tasks.'
                )}
              </DescriptionText>
            </TextContainer>

            {isMobile ? (
              <>
                <CardsContainer>
                  {agents.map((agent) => (
                    <AgentCard key={agent.id} onClick={() => handleSelectAgent(agent.id)}>
                      <AgentImage src={agent.avatar} alt={agent.name} />
                      <TextContent>
                        <AgentName>{agent.name}</AgentName>
                        <AgentDescription>{agent.description}</AgentDescription>
                      </TextContent>
                      <ActionButton 
                        disabled={agent.id === '-1'}
                        disableRipple={agent.id === '-1'}
                      >
                        {agent.id !== '-1' && (
                          <ActionIcon src={livingroomIcon} alt="chat" />
                        )}
                        <ActionText disabled={agent.id === '-1'}>
                          {agent.action}
                        </ActionText>
                      </ActionButton>
                    </AgentCard>
                  ))}
                </CardsContainer>
                <IntegrationText>
                  Mirae will boost your agent's abilities, making it stronger! Any agent can be integrated !
                </IntegrationText>
                <ApplyButton disableRipple>
                  <ApplyButtonText>Apply For Integration &gt;</ApplyButtonText>
                </ApplyButton>
              </>
            ) : (
              <>
                <IntegrationText>
                  Mirae will boost your agent's abilities, making it stronger! Any agent can be integrated !
                </IntegrationText>
                <ApplyButton disableRipple>
                  <ApplyButtonText>Apply For Integration &gt;</ApplyButtonText>
                </ApplyButton>
                <CardsContainer>
                  {agents.map((agent) => (
                    <AgentCard key={agent.id} onClick={() => handleSelectAgent(agent.id)}>
                      <AgentImage src={agent.avatar} alt={agent.name} />
                      <TextContent>
                        <AgentName>{agent.name}</AgentName>
                        <AgentDescription>{agent.description}</AgentDescription>
                      </TextContent>
                      <ActionButton 
                        disabled={agent.id === '-1'}
                        disableRipple={agent.id === '-1'}
                      >
                        {agent.id !== '-1' && (
                          <ActionIcon src={livingroomIcon} alt="chat" />
                        )}
                        <ActionText disabled={agent.id === '-1'}>
                          {agent.action}
                        </ActionText>
                      </ActionButton>
                    </AgentCard>
                  ))}
                </CardsContainer>
              </>
            )}
          </ContentInner>

          <BackgroundContainer>
            <BackgroundLine src={lineSvg} alt="" />
            <BackgroundLine2 src={lineSvg} alt="" />
            <BackgroundLine3 src={lineSvg} alt="" />
          </BackgroundContainer>
        </Content>

        <Footer>
          <InputContainer focused={focused}>
            <StyledInput
              placeholder={isInputDisabled 
                ? `Next generation available in ${remainingTime}` 
                : "Type your prompt here..."}
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => !isInputDisabled && setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={handleKeyPress}
              disabled={isInputDisabled}
              fullWidth
            />
            <GenerateButton
              hasContent={Boolean(inputValue)}
              onClick={handleGenerate}
              disableRipple
              disabled={isInputDisabled || !inputValue}
            >
              <EnterIcon src={enterIcon} alt="enter" />
              <ButtonText>
                Generate
              </ButtonText>
            </GenerateButton>
          </InputContainer>
        </Footer>

        <Snackbar
          open={toast.open}
          onClose={handleCloseToast}
          message={toast.message}
          autoHideDuration={1500}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        />
      </PageContainer>
    </>
  );
} 