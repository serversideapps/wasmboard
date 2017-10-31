class wBoard extends GlobalUtils.WasmLoader{

    ///////////////////////////////////////////////
    // buffer name mappings

    INBUF=0
    OUTBUF=1
    OUTBUF2=2
    TEMPBUF=3
    TEMPBUF2=4
    OUTBUF3=5

    ///////////////////////////////////////////////

    buffers:GlobalUtils.MemView[]
    inbuf:GlobalUtils.MemView
    callback:()=>void
    constructor(_callback:()=>void=null){
        super("assets/wasm/board/board.wasm",{
            "setTempRet0":x=>{},
            "getTempRet0":x=>{},                        
            "_i64Add":x=>{}
        })        
        this.importObject.env["_conslog"]=()=>console.log(this.out(this.OUTBUF3))
        this.callback=_callback
        this.fetchThen(this.onload.bind(this))
    }
    onload(){        
        this.buffers=[]
        for(let i=0;i<this.exports._getNumStrBuffers();i++){
            this.buffers.push(this.memview(this.exports._addr(i), this.exports._getStrBufferLength()))
        }
        this.inbuf=this.buffers[this.INBUF]        
        if(this.callback!=null){
            this.callback()
        }
    }
    in(str:string):wBoard{
        this.inbuf.strCpy(str)
        return this
    }
    out(i:number=this.OUTBUF):string{
        return this.buffers[i].toString()
    }
    toCase(_case:number){
        this.exports._toCase(_case)
    }
    newBoard(variant:number,i:number=0){
        this.exports._newBoard(variant,i)
    }
    reportBoardText(i:number=0):string{
        this.exports._reportBoardText(i)
        return this.out()
    }
    setFromRawFen(fen:string,i:number=0){
        this.in(fen).exports._setFromRawFen(i)
    }
    kindToNumber(kind:string):number{
        switch(kind){            
            case 'n':return 110
            case 'b':return 98
            case 'r':return 114
            case 'q':return 113
            case 'k':return 107
            default: return 45
        }        
    }
    makeMove(m:Move,i:number=0){                
        this.exports._makeMove(
            i,
            m.fromsq.file,
            m.fromsq.rank,
            m.tosq.file,
            m.tosq.rank,
            this.kindToNumber(m.prom.kind),
            m.prom.color+48
        )
    }
    setTurn(color:number,i:number=0){
        this.exports._setTurn(i,color+48)
    }
    setFullmoveNumber(fn:number,i:number=0){
        this.exports._setFullmoveNumber(i,fn)
    }
    setHalfmoveClock(hc:number,i:number=0){
        this.exports._setHalfmoveClock(i,hc)
    }
    resetEpSquares(i:number=0){
        this.exports._resetEpSquaresI(i)
    }
    setEpSquare(        
        color:number,
        epf:number,
        epr:number,
        epclf:number,
        epclr:number,
        cnt:number,
        i:number=0
    ){
        this.exports._setEpSquare(i,color+48,epf,epr,epclf,epclr,cnt+1)
    }
    resetCastlingRegistries(i:number=0){
        this.exports._resetCastlingRegistriesI(i);
    }
    setCastlingRegistry(
        ci:number,
        cs:number,
        right:number,
        kf:number,
        kr:number,
        rf:number,
        rr:number,
        i:number=0
    ){
        this.exports._setCastlingRegistry(i,ci,cs,right,kf,kr,rf,rr)
    }
    setCastlingRegistryEmpty(
        ci:number,
        cs:number,
        si:number,        
        f:number,
        r:number,
        i:number=0
    ){
        this.exports._setCastlingRegistryEmpty(i,ci,cs,si,f,r)
    }
    setCastlingRegistryPassing(
        ci:number,
        cs:number,
        si:number,
        f:number,
        r:number,
        i:number=0
    ){
        this.exports._setCastlingRegistryPassing(i,ci,cs,si,f,r)
    }
    sortedLegalSanList(i:number=0):string{
        this.exports._sortedLegalSanListI(i)
        return this.out()
    }
    deleteGameInfo(i:number=0){
        this.exports._deleteGameInfoI(i)
    }
    back(i:number=0){
        this.exports._backI(i)
    }
    forward(i:number=0){
        this.exports._forwardI(i)
    }
    delete(i:number=0){
        this.exports._deleteI(i)
    }
    tobegin(i:number=0){
        this.exports._tobeginI(i)
    }
    toend(i:number=0){
        this.exports._toendI(i)
    }
}