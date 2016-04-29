<!--
opts = {
  notes: [
    {
      x: <Number> X 座標 (px)
      y: <Number> Y 座標 (px)
      width: <Number> 横幅 (px)
    }
  ],
  quantizer: <Quantizer>
  coordConverter: <NoteCoordConverter>
  mode: <Number> 0: 鉛筆, 1: 範囲選択
  onCreateNote: <Function(bounds)> 
  onResizeNote: <Function(noteId, bounds)>
  onClickNote: <Function(noteId)>
  onSelectNotes: <Function(notes)>
  onMoveNotes : <Function(notes, movement)>
  onClickNotes <Function(notes, mouseEvent)>
}
-->
<notes>
  <div 
    class="container" 
    name="container"
    style="width: { containerWidth }px; height: { containerHeight }px;">
    <canvas 
      class="noteCanvas"
      name="noteCanvas"></canvas>
  </div>

  <script type="text/javascript">
    const RULER_HEIGHT = 30
    const KEY_WIDTH = 100

    this.containerWidth = 500 + KEY_WIDTH
    this.containerHeight = coordConverter.getPixelsForNoteNumber(0) + RULER_HEIGHT

    selection = {hidden: true}
    this.selections = [selection]
    this.notes = opts.notes

    var stage
    const noteContainer = new createjs.Container
    noteContainer.on("mousedown", e => {
      mouseHandler.onMouseDown(e)
      stage.update()
    })

    var mouseHandler = [ 
      new PencilMouseHandler(noteContainer, opts),
      new SelectionMouseHandler(noteContainer, opts)
    ][opts.mode]
    this.mouseHandler = mouseHandler

    this.on("mount", () => {
      stage = new createjs.Stage(this.noteCanvas)
      stage.enableMouseOver()
      document.noteStage = stage
      
      const keys = new PianoKeysView(KEY_WIDTH, quantizer.unitY, 127)
      keys.y = RULER_HEIGHT
      stage.addChild(keys)

      const grid = new PianoGridView(quantizer.unitY, 127, RULER_HEIGHT, coordConverter, 1000)
      grid.x = KEY_WIDTH
      stage.addChild(grid)

      noteContainer.x = KEY_WIDTH
      noteContainer.y = RULER_HEIGHT
      stage.addChild(noteContainer)

      stage.update()
    })

    this.on("update", () => {
      if (stage == null) {
        return
      }

      const maxNoteX = Math.max(500, this.notes != null && this.notes.length > 0 ? 
        Math.max.apply(null, (this.notes.map(n => n.x + n.width))) : 0)

      this.containerWidth = Math.ceil(maxNoteX) + KEY_WIDTH
      this.noteCanvas.width = this.containerWidth
      this.noteCanvas.height = this.containerHeight

      console.log(this.notes.length)
      this.notes.forEach(note => {
        let rect = _.find(noteContainer.children, r => r.noteId == note.id)
        if (!rect) {
          rect = new createjs.Shape()
          rect.noteId = note.id

          rect.on("mousedown", function(e) {
            mouseHandler.onMouseDownNote(e)
            e.stopPropagation()
            stage.update()
          })

          rect.on("mouseover", function(e) {
            mouseHandler.onMouseOverNote(e)
          })

          rect.on("mouseout", function(e) {
            mouseHandler.onMouseOutNote(e)
          })

          rect.on("pressmove", function(e) {
            mouseHandler.onPressMoveNote(e)
            stage.update()
          })

          rect.on("mouseup", function(e) {
            mouseHandler.onMouseUpNote(e)
            stage.update()
          })

          noteContainer.addChild(rect)
        }
        rect.graphics.clear().beginFill("DeepSkyBlue").rect(0, 0, note.width, 30)
        rect.x = note.x
        rect.y = note.y
        rect.setBounds(note.x, note.y, note.width, quantizer.unitY)
      })
      stage.update()
    })

    this.container.oncontextmenu = e => {
      e.preventDefault()
    }
  </script>

  <style scoped>
    .container {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .note {
      height: 30px;
      position: absolute;
      background: -webkit-linear-gradient(top, #5867FA, #3e4eee);
      box-sizing: border-box;
      border: 1px solid rgb(88, 103, 250);
    }

    .note.selected {
      background: rgb(0, 0, 0);
    }

    .selection {
      position: absolute;
      border: 3px solid rgb(0, 0, 0);
      box-sizing: border-box;
    }

    .noteCanvas {
      position: absolute;
      top: 0;
      left: 0;
    }

  </style>
</notes>
