import React, {Component} from 'react';
import {
  View,
  ListView,
  Text,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from 'react-native';

import sdk from 'react-native-social-kit';
let Weixin = sdk.Weixin;

import styles from './Style';
let WINDOW_WIDTH = Dimensions.get('window').width;
let WINDOW_HEIGHT = Dimensions.get('window').height;

import content from  './ShareContent';

let DataArr = {
  '分享方式': {
    title: '分享方式',
    rowData: [
      {
        type1: {
          title: '好友',
          scene: 'WXSceneSession'
        },
        type2: {
          title: '朋友圈',
          scene: 'WXSceneTimeline'
        },
        type3: {
          title: '收藏',
          scene: 'WXSceneFavorite'
        },
      }
    ]
  },
  '分享内容': {
    title: '分享内容',
    rowData: [
      {
        type1: {
          title: '文本',
          messageType: 'text'
        },
        type2: {
          title: '图片',
          messageType: 'image'
        },
        type3: {
          title: '链接',
          messageType: 'webLink'
        },
        type4: {
          title: '音乐',
          messageType: 'music'
        },
        type5: {
          title: '视频',
          messageType: 'video'
        },
        type6: {
          title: 'App',
          messageType: 'app'
        },
        type7: {
          title: '图片表情',
          messageType: 'nonGif'
        },
        type8: {
          title: 'Gif表情',
          messageType: 'gif'
        },
        type9: {
          title: '文件',
          messageType: 'file'
        },
      }
    ]
  },
  '分享': {
    title: '分享',
    rowData: [
      {
        type1: {
          title: '分享',
          func: 'share'
        }
      }
    ]
  },
  '其他Api': {
    title: '其他Api',
    rowData: [
      {
        type1: {
          title: '是否安装微信?',
          api: 'isWXAppInstalled'
        },
        type2: {
          title: '是否支持Api?',
          api: 'isWXAppSupportApi'
        },
        type3: {
          title: 'ITunes地址',
          api: 'getWXAppInstallUrl'
        },
        type4: {
          title: 'Api版本',
          api: 'getApiVersion'
        },
        type5: {
          title: '打开微信',
          api: 'openWXApp'
        },
        type6: {
          title: '授权登陆',
          api: 'authorize'
        },
        type7: {
          title: '支付',
          api: 'pay'
        },
      }
    ]
  },


};

export default class WeixinSDK extends Component {

  constructor(props) {
    super(props);
    this.state = {
      scene: 'WXSceneSession',
      messageType: 'text',
      api: 'isWXAppInstalled',
      shareResult: '--------',
      apiResult: '---------' || {}
    }
  }


  componentWillMount() {
    // 注册App
    Weixin.registerApp({
      appId: "wx1dd0b08688eecaef"
    }, (data) => {
    });
  }

  render() {

    let dataSource = new ListView.DataSource({
      getRowData: (dataBlob, sectionID, rowID, rowIndex) => {
        return dataBlob[sectionID].rowData[rowID];
      },
      getSectionHeaderData: (dataBlob, sectionID) => {
        return dataBlob[sectionID];
      },
      rowHasChanged: (r1, r2) => {
        r1 !== r2;
      },
      sectionHeaderHasChanged: (s1, s2) => {
        s1 !== s2;
      }
    });
    let sectionIDs = Object.keys(DataArr);
    let rowIDs = sectionIDs.map(sectionID => {
      let count = DataArr[sectionID].rowData.length;
      let thisRow = [];
      for (let i = 0; i < count; i++) {
        thisRow.push(i);
      }
      return thisRow;
    });

    return (
      <ScrollView
      style = {styles.container}
      >
        <View style={styles.navigator}>
          <Text
            style= {{position : 'absolute',alignSelf : 'center',left: 5,top: 10,fontSize : 20,fontWeight: 'bold',color:'#316532'}}
            onPress = {this.pop.bind(this)}
          >{'<首页'}</Text>
          <Text
            style = {{alignSelf : 'center',fontSize : 25,fontWeight: 'bold',color:'black'}}
          >{this.props.title?this.props.title:'微信'}</Text>
        </View>
        <ListView
          dataSource={dataSource.cloneWithRowsAndSections(DataArr,sectionIDs,rowIDs)}
          renderRow={this.renderRow.bind(this)}
          renderSectionHeader={this.renderSectionHeader.bind(this)}

        />
      </ScrollView>
    )
  }

  _onPressHandle(rowData) {
    if (rowData.scene && rowData.scene.length > 0) {
      this.setState({scene: rowData.scene})
    } else if (rowData.messageType && rowData.messageType.length > 0) {
      this.setState({messageType: rowData.messageType}) 
    } else if (rowData.api && rowData.api.length > 0) {
      this.setState({api: rowData.api})
      this.apiHandler(rowData.api);
    } else {
      this.shareMessage();
    }
  }

  pop() {
    const {navigator} = this.props;
    if (navigator) {
      navigator.pop();
    }
  }

  // 渲染cell
  renderRow(rowData, sectionID:number, rowID:number) {
    let rowdataIDs = Object.keys(rowData);
    // let borderColor = 'red';
    let content = rowdataIDs.map((id) => {
      let selectedStyle = this.getSelectedStyle(rowData[id]);
      return (
        <TouchableOpacity
          key={id}
          style={{width:105,height:60,justifyContent:'center',alignItems:'center'}}
          onPress={() => {this._onPressHandle(rowData[id])}}
        >
          <View style={[styles.row,selectedStyle]}>
            <Text style={styles.text}>
              {rowData[id].title}
            </Text>
          </View>
        </TouchableOpacity>
      )
    });
    let resultComponent = this.getResultComponent(rowData, sectionID);
    return (
      <View
        style={styles.rowContent}
      >
        {content}
        {resultComponent}
      </View>
    );
  }

  renderSectionHeader(data, sectionID, rowID) {
    return (
      <View style={styles.sectionHeader}>
        <Text
          style={styles.sectionHeaderFont}
        >{data.title}</Text>
      </View>
    )
  }

  //Private
  getSelectedStyle(rowData) {
    if ((rowData.scene && rowData.scene == this.state.scene) || (rowData.messageType && rowData.messageType == this.state.messageType)) {
      return {borderColor: '#4E9136', backgroundColor: '#4E9136'};
    } else if (rowData.api && rowData.api == this.state.api) {
      return {borderColor: '#4E9136', backgroundColor: '#4E9136',};
    } else if (!rowData.scene && !rowData.messageType && !rowData.api) {
      return {width: 310}
    }
  }

  getResultComponent(rowData, sectionID) {

    if (sectionID == '其他Api') {
      return (
        <View style={styles.resultRow}>
          <Text style={styles.text}>Api返回结果</Text>
          <Text style={styles.text}>{JSON.stringify(this.state.apiResult)}</Text>
        </View>
      )
    } else if (sectionID == '分享') {
      return (
        <View style={styles.resultRow}>
          <Text style={styles.text}>分享返回结果</Text>
          <Text style={styles.text}>{this.state.shareResult}</Text>
        </View>

      )
    } else {
      return <View/>
    }
  }


  //分享方法

  shareMessage() {
    if (this.state.messageType == 'text') {
      this.shareTextToWXReq(this.state.scene);
    } else if (this.state.messageType == 'image') {
      this.shareImageToWXReq(this.state.scene);
    } else if (this.state.messageType == 'webLink') {
      this.shareWebPageToWXReq(this.state.scene);
    } else if (this.state.messageType == 'music') {
      this.shareMusicToWXReq(this.state.scene);
    } else if (this.state.messageType == 'video') {
      this.shareVideoToWXReq(this.state.scene);
    } else if (this.state.messageType == 'app') {
      this.shareAppToWXReq(this.state.scene);
    } else if (this.state.messageType == 'nonGif') {
      this.shareNonGifToWXReq(this.state.scene);
    } else if (this.state.messageType == 'gif') {
      this.shareGifToWXReq(this.state.scene);
    } else if (this.state.messageType == 'file') {
      this.shareFileToWXReq(this.state.scene);
    }
  }

  shareTextToWXReq(scene) {
    Weixin.shareText({
      text: content.text.text,
      scene: scene
    }, (data) => {
      console.log(JSON.stringify(data));
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  shareImageToWXReq(scene) {
    Weixin.shareImage({
      text: content.image.title,
      scene: scene,
      imagePath: content.image.imagePath,
      thumbImage: content.image.thumbImage,
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  shareWebPageToWXReq(scene) {
    Weixin.shareWebPage({
      title: content.webPage.title,
      description: content.webPage.description,
      scene: scene,
      webpageUrl: content.webPage.webpageUrl,
      thumbImage: content.webPage.thumbImage
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  shareMusicToWXReq(scene) {
    Weixin.shareMusic({
      title: content.music.title,
      description: content.music.description,
      musicUrl: content.music.musicUrl,
      musicDataUrl: content.music.musicDataUrl,
      scene: scene,
      thumbImage: content.music.thumbImage
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  shareVideoToWXReq(scene) {

    Weixin.shareVideo({
      title: content.video.title,
      description: content.video.description,
      videoUrl: content.video.videoUrl,
      scene: scene,
      thumbImage: content.video.thumbImage
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  shareAppToWXReq(scene) {

    Weixin.shareApp({
      title: content.app.title,
      description: content.app.description,
      extInfo: content.app.extInfo,
      url: content.app.url,
      scene: scene,
      thumbImage: content.app.thumbImage
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  shareNonGifToWXReq(scene) {

    Weixin.shareNonGif({
      title: content.nonGif.title,
      description: content.nonGif.description,
      scene: scene,
      thumbImage: content.nonGif.thumbImage,
      nonGifPath: content.nonGif.nonGifPath,
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  shareGifToWXReq(scene) {

    Weixin.shareGif({
      title: content.gif.title,
      description: content.gif.title,
      scene: scene,
      thumbImage: content.gif.thumbImage,
      gifPath:content.gif.gifPath,
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  shareFileToWXReq(scene) {

    Weixin.shareFile({
      title: content.file.title,
      description: content.file.description,
      scene: scene,
      thumbImage: content.file.thumbImage,
      filePath: content.file.filePath,
    }, (data) => {
      this.setState({shareResult: JSON.stringify(data)})
    });
  }

  //Api方法
  apiHandler(apiName) {
    if (apiName === "isWXAppInstalled") {
      this.isWXAppInstalled();
    } else if (apiName === "isWXAppSupportApi") {
      this.isWXAppSupportApi();
    } else if (apiName === "getWXAppInstallUrl") {
      this.getWXAppInstallUrl();
    } else if (apiName === "getApiVersion") {
      this.getApiVersion();
    } else if (apiName === "openWXApp") {
      this.openWXApp();
    } else if (apiName === "authorize") {
      this.auth();
    }else if (apiName === "pay") {
      this.pay();
    }
  }

  isWXAppInstalled() {
    Weixin.isWXAppInstalled((data) => {
      this.setState({
        apiResult: data
      })
    });
  }

  isWXAppSupportApi() {
    Weixin.isWXAppSupportApi((data) => {
      this.setState({
        apiResult: data
      })
    });
  }

  getWXAppInstallUrl() {
    Weixin.getWXAppInstallUrl((data) => {
      this.setState({
        apiResult: data
      })
    });
  }

  getApiVersion() {
    Weixin.getApiVersion((data) => {
      this.setState({
        apiResult: data
      })
    });
  }

  openWXApp() {
    Weixin.openWXApp((data) => {
      this.setState({
        apiResult: data
      })
    });
  }

  auth() {
    Weixin.authorize(
      {scope: "snsapi_userinfo", state: "123"},
      (data) => {
        this.setState({
          apiResult: data
        })
      });
  }

  pay() {
    Weixin.pay(
      null,
      (data) =>{
        console.log(JSON.stringify(data));
        this.setState({
          apiResult: data
        })
      },
      (data) =>{
        console.log(JSON.stringify(data));
        this.setState({
          apiResult: data
        })
      }
    )
  }

}
