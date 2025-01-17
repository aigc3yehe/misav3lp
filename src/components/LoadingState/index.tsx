import { Box, styled } from '@mui/material';
import Lottie from 'lottie-react';
import loadingAnimation from '../../assets/loading.json';

const LoadingContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 128,
  height: 128,
  [theme.breakpoints.down('sm')]: {
    width: '4rem',
    height: '4rem',
  },
}));

export default function LoadingState() {
  return (
    <LoadingContainer>
      <Lottie 
        animationData={loadingAnimation}
        loop={true}
        autoplay={true}
      />
    </LoadingContainer>
  );
} 