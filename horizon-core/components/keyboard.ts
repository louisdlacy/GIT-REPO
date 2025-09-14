import * as hz from 'horizon/core';
import * as ui from 'horizon/ui'

const height = 60
const caps = 'CAPS'
const shift = 'SHIFT'
const charLimit = 140

const submit = new hz.NetworkEvent<{text: string}>('submit')

class keyboard extends ui.UIComponent<typeof keyboard> {

  panelWidth = height * 16.5
  panelHeight = height * 9.6

  static propsDefinition = {
    receiveText: {type: hz.PropTypes.Entity} //You can send the written text to this object when you press enter
  };

  upperCase = new ui.Binding<boolean>(true)
  caps = new ui.Binding<boolean>(false)
  shift = new ui.Binding<boolean>(true)
  text = new ui.Binding<string>('|')
  curser = new ui.Binding<number>(0)

  initializeUI() {
    return ui.View({
      children: [
        this.keyboard(),
      ],
      style: {
        backgroundColor: hz.Color.white,
        borderRadius: height / 4,
        padding: height / 10,
      }
    })
  }

  keyboard(){
    return ui.View({
      children: [
        //this.instructions(),
        this.textField(),
        this.keyboardRow1(),
        this.keyboardRow2(),
        this.keyboardRow3(),
        this.keyboardRow4(),
        this.keyboardRow5(),
      ],
      style: {
        borderRadius: height / 4,
      }
    })
  }

  instructions() {
    return ui.Text({
      text: 'Write a post',
      style: {
        fontSize: height / 2,
        color: hz.Color.black,
        textAlign: 'center',
      }
    })
  }

  textField() {
    return ui.View({
      children: ui.Text({
        text: this.text,
        style: {
          fontSize: height / 2,
          color: hz.Color.black,
          textAlign: 'left',
        }
      }),
      style: {
        backgroundColor: new hz.Color(0.9, 0.9, 0.9),
        borderRadius: height / 5,
        margin: height / 20,
        width: height * 16.2,
        height: height * 3,
        padding: height / 5,
        marginRight: height / 10
      }
    })
  }

  keyboardRow1() {
    let timout = this.async.setTimeout(()=>{}, 0)
    let interval = this.async.setInterval(()=>{}, 0)
    return ui.View({
      children: [
        this.button('`', '~', 1),
        this.button('1', '!', 1),
        this.button('2', '@', 1),
        this.button('3', '#', 1),
        this.button('4', '$', 1),
        this.button('5', '%', 1),
        this.button('6', '^', 1),
        this.button('7', '&', 1),
        this.button('8', '*', 1),
        this.button('9', '(', 1),
        this.button('0', ')', 1),
        this.button('-', '_', 1),
        this.button('=', '+', 1),
        this.button("<---", '', 2, () => {
          this.backspace()
          timout = this.async.setTimeout(()=>{
            this.backspace()
            interval = this.async.setInterval(()=>{
              this.backspace()
            }, 50)
          },300)
        }, () => {this.async.clearInterval(interval); this.async.clearTimeout(timout)}),
      ],
      style: {
        flexDirection: 'row'
      }
    })
  }

  backspace(){
    this.curser.set(cur=>{
      if(cur === 0)
        return cur
      this.text.set(curr => {
        this.caps.set(caps=>{
          if (!caps && curr.length === 2){
            this.upperCase.set(true)
            this.shift.set(true)
          }
          return caps
        })
        return curr.slice(0, cur - 1) + curr.slice(cur)
      })
      return cur - 1
    })
  }

  keyboardRow2() {
    return ui.View({
      children: [
        this.button('TAB', '    ', 1.5, () => {
          let maxChar = false
          this.curser.set(cur=>{
            this.text.set(curr => {
              if(curr.length > charLimit-3){
                maxChar = true
                return curr
              }
              return curr.slice(0, cur) + '    ' + curr.slice(cur)
            })
            if(maxChar){
              maxChar = false
              return cur
            }
            return cur + 4
          })
        }),
        this.button('q', 'Q', 1),
        this.button('w', 'W', 1),
        this.button('e', 'E', 1),
        this.button('r', 'R', 1),
        this.button('t', 'T', 1),
        this.button('y', 'Y', 1),
        this.button('u', 'U', 1),
        this.button('i', 'I', 1),
        this.button('o', 'O', 1),
        this.button('p', 'P', 1),
        this.button('[', '{', 1),
        this.button(']', '}', 1),
        this.button("\\", '|', 1.5, undefined),
      ],
      style: {
        flexDirection: 'row'
      }
    })
  }

  keyboardRow3() {
    return ui.View({
      children: [
        this.button(caps, '', 1.75, () => {
          
          
          this.caps.set(caps => {
            this.shift.set(shift=>{
              if(!shift || caps){
                this.upperCase.set(up => !up)
                return shift
              }
              return false
            })
            return !caps
          })
        }),
        this.button('a', 'A', 1),
        this.button('s', 'S', 1),
        this.button('d', 'D', 1),
        this.button('f', 'F', 1),
        this.button('g', 'G', 1),
        this.button('h', 'H', 1),
        this.button('j', 'J', 1),
        this.button('k', 'K', 1),
        this.button('l', 'L', 1),
        this.button(';', ':', 1),
        this.button('\'', '"', 1),
        this.button('ENTER', '', 2.5, () => {
          this.text.set(text=>{
            this.curser.set(cur=>{
              const withoutCurser = text.slice(0, cur) + text.slice(cur + 1)
              if(!this.props.receiveText) return cur
              this.sendNetworkEvent(this.props.receiveText, submit, {text: withoutCurser})
              return cur
            })
            return text
          })
        }),
      ],
      style: {
        flexDirection: 'row'
      }
    })
  }

  keyboardRow4() {
    return ui.View({
      children: [
        this.button(shift, '', 2.25, () => {
          this.shift.set(up => !up)
          this.upperCase.set(up => !up)
        }),
        this.button('z', 'Z', 1),
        this.button('x', 'X', 1),
        this.button('c', 'C', 1),
        this.button('v', 'V', 1),
        this.button('b', 'B', 1),
        this.button('n', 'N', 1),
        this.button('m', 'M', 1),
        this.button(',', '<', 1),
        this.button('.', '>', 1),
        this.button('/', '?', 1),
        this.button(shift, '', 3.25, () => {
          this.shift.set(up => !up)
          this.upperCase.set(up => !up)
        }),
      ],
      style: {
        flexDirection: 'row'
      }
    })
  }

  keyboardRow5() {
    let leftTimeout = this.async.setTimeout(()=>{}, 0)
    let rightTimeout = this.async.setTimeout(()=>{}, 0)
    let leftInterval = this.async.setInterval(()=>{}, 0)
    let rightInterval = this.async.setInterval(()=>{}, 0)
    return ui.View({
      children: [
        this.button('<-', '', 4.5, () => { 
          this.async.clearInterval(rightInterval)
          this.async.clearTimeout(rightTimeout)
          this.prevChar()
          leftTimeout = this.async.setTimeout(()=>{
            this.prevChar()
            leftInterval = this.async.setInterval(()=>{
              this.prevChar()
            }, 50)
          }, 300)
        }, () => {this.async.clearInterval(leftInterval); this.async.clearTimeout(leftTimeout)}),
        this.button('SPACE', '', 8.25, () => {
          let maxChar = false
          this.curser.set(cur=>{
            this.text.set(curr => {
              if(curr.length > charLimit){
                maxChar = true
                return curr
              }
              if(curr.endsWith('.|') || curr.endsWith('!|') || curr.endsWith('?|')){
                this.caps.set(caps=>{
                  if (!caps){
                    this.upperCase.set(true)
                    this.shift.set(true)
                  }
                  return caps
                })
              }
              return curr.slice(0, cur) + ' ' + curr.slice(cur)
            })
            if(maxChar){
              maxChar = false
              return cur
            }
            return cur + 1
          })
          
        }),
        this.button('->', '', 4.5, ()=>{
          this.nextChar()
          this.async.clearInterval(leftInterval)
          this.async.clearTimeout(leftTimeout)
          rightTimeout = this.async.setTimeout(()=>{
            this.nextChar()
            rightInterval = this.async.setInterval(()=>{
              this.nextChar()
            }, 50)
          }, 300)
        }, ()=>{this.async.clearInterval(rightInterval); this.async.clearTimeout(rightTimeout)}),
      ],
      style: {
        flexDirection: 'row'
      }
    })
  }

  prevChar(){
    this.curser.set(cur=>{
      if(cur === 0)
        return cur
      this.text.set(curr => {
        return curr.substring(0, cur - 1) + '|' + curr.charAt(cur-1) + curr.slice(cur + 1)
      })
      return cur - 1
    })
  }

  nextChar(){
      this.curser.set(cur=>{
        let length = 0
        this.text.set(curr => {
          length = curr.length
          if(cur === length - 1)
            return curr
          return curr.substring(0, cur) + curr.charAt(cur + 1) + '|' + curr.slice(cur + 2)
        })
        if(cur === length - 1)
          return cur
        return cur + 1
      })
  }

  button(lowercase: string, uppercase: string, width: number, press?: ui.Callback, release?: ui.Callback) {
    return ui.Pressable({
      children: ui.Text({
        text: this.upperCase.derive(up => (up && !press) ? uppercase : lowercase),
        style: {
          fontSize: height / 2,
          color: hz.Color.black,
          textAlign: 'center',
          position: 'absolute',
          layoutOrigin: [0.5, 0.5],
          top: '50%',
          left: '50%',
          textDecorationLine: lowercase === caps ? this.caps.derive(caps => caps ? 'underline' : 'none') : lowercase === shift ? this.shift.derive(shift => shift ? 'underline' : 'none') : 'none'
        }
      }),
      style: {
        backgroundColor: new hz.Color(0.9, 0.9, 0.9),
        width: height * width,
        height,
        borderRadius: height / 5,
        margin: height / 20,
        flex: -1
      },
      onPress: press ? press : () => {
        let maxChar = false
        this.shift.set(shift => {
          this.upperCase.set(up => {
            this.curser.set(cur=>{
              this.text.set(curr => {
                if(curr.length > charLimit){
                  maxChar = true
                  return curr
                }
                let next = up ? uppercase : lowercase
                next = curr.slice(0, cur) + next + curr.slice(cur)
                return next
              })
              if(maxChar){
                maxChar = false
                return cur
              }
              return cur + 1
            })
            return shift ? !up : up
          })
          return press ? shift : false
        })
      },
      onRelease: release ? release : () => {}
    })
  }
}
hz.Component.register(keyboard);