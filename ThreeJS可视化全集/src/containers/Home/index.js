import './index.styl';
import React from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MediaCard from '../../components/MediaCard/index';
import Grid from '@mui/material/Grid';
import developingImage from './images/developing.png';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const workList = [
  {
    link: '#/human',
    title: 'Metahuman',
    description: 'ð¦ åå®å®æ°å­äººç±»ãâ ä¼åä¸­ã',
    image: require('@/containers/Home/images/human.png'),
    three: true
  },
  {
    link: '#/shadow',
    title: 'åä¸å½±ä¹è¯',
    description: 'ð¿ åå½±ææææåæé¡µé¢',
    image: require('@/containers/Home/images/shadow.png'),
    three: true
  },
  {
    link: '#/olympic',
    title: '2022å¬å¥¥ä¼3Dè¶£å³é¡µé¢',
    description: 'ð¼ èèçå°å¢©å¢©åéªå®¹èéç»å¤§å®¶ï¼',
    image: require('@/containers/Home/images/olympic.png'),
    three: true
  },
  {
    link: '#/fans',
    title: 'æé1000ç²ï¼ï¼ï¼',
    description: 'ð è°¢è°¢å³æ³¨',
    image: require('@/containers/Home/images/fans.png'),
    three: true
  },
  {
    link: '#/ocean',
    title: 'æ¢¦ä¸­æå²',
    description: 'ð ç¼¤çº·å¤æ¥3Dæ¢¦ä¸­æå²ï¼',
    image: require('@/containers/Home/images/ocean.png'),
    three: true
  },
  {
    link: '#/ring',
    title: 'è¾å°ç»æ³ç¯Logo',
    description: 'ð¥ ç«ç°ææèå¤´ç¯ ï¼ï¼ï¼',
    image: require('@/containers/Home/images/ring.png'),
    three: true
  },
  {
    link: '#/earth',
    title: 'å°ç',
    description: 'ð å®å®ä¸­å­¤ç¬çèèè²æçï¼',
    image: require('@/containers/Home/images/earth.png'),
    three: true
  },
  {
    link: '#/metaverse',
    title: 'é¿ç¸çå¤åå®å®',
    description: 'ð¦ é¿ç¸çæéæ·éä¹æ¯ï¼',
    image: require('@/containers/Home/images/metaverse.png'),
    three: true
  },
  {
    link: '#/floating',
    title: 'æ¬æµ®æå­',
    description: 'ð Fantastic floating text',
    image: require('@/containers/Home/images/floating.png'),
    three: true
  },
  {
    link: '#/earthDigital',
    title: 'èµåæå2077é£æ ¼æ°å­å°ç',
    description: 'ð Cyberpunk!!!',
    image: require('@/containers/Home/images/earthDigital.png'),
    three: true
  },
  {
    link: '#/comic',
    title: '3Dæ¼«ç»',
    description: 'ð· spider man',
    image: require('@/containers/Home/images/comic.png'),
    three: true
  },
  {
    link: '#/scroll',
    title: 'åºäºæ»å¨ç3Då¸å±',
    description: 'ð¥ Gsap å¨ç»åºç¨ï¼',
    image: require('@/containers/Home/images/scroll.png'),
    three: true
  },
  {
    link: '#/city',
    title: 'æ°å­åå¸',
    description: 'ð 3Dæ°å­åå¸ ãâ ä¼åä¸­ã',
    image: require('@/containers/Home/images/city.png'),
    three: true
  },
  {
    link: '#/tennis',
    title: 'ç½ç',
    description: 'ð¾ ç©çæææ¨¡æ',
    image: require('@/containers/Home/images/tennis.png'),
    three: true
  },
  {
    link: 'https://dragonir.github.io/3d-meta-logo/',
    title: 'è¸ä¹¦Metaåå®å®Logo',
    description: 'ðª Three.js + Blender å®ç°ç«é·çFacebookåå®å®Logo.',
    image: require('@/containers/Home/images/meta.png'),
    three: true
  },
  {
    link: '#/lunar',
    title: 'èå¹´æ¥èåæ',
    description: 'ð 2022èèçå¨ï¼',
    image: require('@/containers/Home/images/lunar.png'),
    three: true
  },
  {
    link: 'https://dragonir.github.io/3d-panoramic-vision/',
    title: 'å¨æ¯ä¾¦æ¢å°æ¸¸æ',
    description: 'ðµï¸â ä½¿ç¨Three.jså¨æ¯åè½å®ç°ä¾¦æ¢å°æ¸¸æã',
    image: require('@/containers/Home/images/panoramic.png'),
    three: true
  },
  {
    link: '#/segmentfault',
    title: 'SegmentFaultçªç ´1000ç²çºªå¿µ',
    description: 'ð 1000+ followers ï¼',
    image: require('@/containers/Home/images/segmengfault.png'),
    three: true
  },
  {
    link: '#/live',
    title: 'èæä¸»æ­',
    description: 'ð èæä¸»æ­åé³æªæ¥ãâ ä¼åä¸­ã',
    image: require('@/containers/Home/images/live.png'),
    three: true
  },
  {
    link: '#/cell',
    title: 'å¨æ¤ç©ç»èç»æ',
    description: 'ð» å¯ä»¥æ¥çå¨ç©ç»èåæ¤ç©ç»èçåé¨ç»æç»æããâ ä¼åä¸­ã',
    image: require('@/containers/Home/images/cell.png'),
    three: true
  },
  {
    link: '#/car',
    title: 'Lamborghini Centenario LP-770',
    description: 'ð·è½¦è¾æ¨¡åå±ç¤ºãâ ä¼åä¸­ã',
    image: require('@/containers/Home/images/car.png'),
    three: true
  },
  {
    link: '#/zelda',
    title: 'å¡å°è¾¾ï¼æ·éä¹æ¯3D',
    description: 'ð· æåãâ ä¼åä¸­ã',
    image: require('@/containers/Home/images/zelda.png'),
    three: true
  },
  {
    link: '#/',
    title: 'è¿èªï¼æ å°½çææ ¼ææ¥',
    description: 'å¼åä¸­...',
    image: developingImage,
    three: true
  },
  {
    link: '#/',
    title: 'æ¢ç´¢ï¼æ äººæ·±ç©º',
    description: 'å¼åä¸­...',
    image: developingImage,
    three: true
  },
  {
    link: '#/',
    title: 'çéï¼å¤±è½çæç',
    description: 'å¼åä¸­...',
    image: developingImage,
    three: true
  },
  {
    link: '#/',
    title: 'èªå·¡ï¼è¿·å¤±å¨é»æ´',
    description: 'å¼åä¸­...',
    image: developingImage,
    three: true
  },
  {
    link: 'https://dragonir.github.io/h5-scan-qrcode/',
    title: 'æµè§å¨æ«ç ',
    description: 'ð· ä½¿ç¨åçæµè§å¨å°±å¯ä»¥å¨h5é¡µé¢å®ç°æ«ç åè½äºï¼è¯è¯çï¼',
    image: require('@/containers/Home/images/scan.png'),
  },
  {
    link: 'https://dragonir.github.io/zelda-map/',
    title: 'å¡å°è¾¾ï¼æ·éä¹æ¯å°å¾',
    description: 'ðº å¨å°å¾ä¸æ è®°ç¥åºãæ¥è¯¢åå¿ç¹ï¼',
    image: require('@/containers/Home/images/zelda_map.png'),
  }
];

export default class Home extends React.Component {
  render () {
    return (
      <div className="home_page" style={{ padding: '24px'}}>
        <Box>
          <h1 className="page_title">3D Example List</h1>
        </Box>
        <Box sx={{ width: '100%' }} style={{ maxWidth: '1200px', margin: 'auto' }}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            {workList.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Item elevation={0} className="grid_item">
                  {item.three ? (<i className="three_logo"></i>) : '' }
                  <MediaCard link={item.link} title={item.title} image={item.image} description={item.description} />
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
    )
  }
}