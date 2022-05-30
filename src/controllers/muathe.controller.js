const DBconnection = require('../DB')
class muathe{
    homePage(req,res){
        res.render('muathe')
    }

    confirm(req,res){
        let {menhgia10000,menhgia20000,menhgia50000,menhgia100000,nhamang} = req.body

        let listThe = []
        if(menhgia10000 > 0){
            for(let i = 0; i<menhgia10000; i++){
                listThe.push(10000)
            }
        }
        if(menhgia20000 > 0){
            for(let i = 0; i<menhgia10000; i++){
                listThe.push(20000)
            }
        }
        if(menhgia50000 > 0){
            for(let i = 0; i<menhgia10000; i++){
                listThe.push(50000)
            }
        }
        if(menhgia100000 > 0){
            for(let i = 0; i<menhgia10000; i++){
                listThe.push(100000)
            }
        }

        console.log(listThe)
        let tonggia = menhgia10000*10000 + menhgia20000 * 20000 + menhgia50000 * 50000 + menhgia100000*100000;

        DBconnection.query(`SELECT SoDu FROM taikhoan WHERE username = 0000000003`, (err,result) => {
            if(err){
                return res.send(JSON.stringify({code: 500}))
            }
            else{
                if(tonggia > result[0].SoDu){
                    return res.send(JSON.stringify({msg: 'Số dư không đủ'}))
                }
                else{
                        DBconnection.query(`UPDATE taikhoan SET SoDu = SoDu - tonggia WHERE username = 0000000003`)
                        DBconnection.query(`INSERT INTO muathe(username) VALUES (0000000003)`, (err, result)=> {
                            if(err) {
                                return res.send(JSON.stringify({code: 500}))
                            }
                            else{
                                let IDGiaoDich = result.insertId
                                for(const menhgia of listThe){
                                    DBconnection.query(`INSERT INTO themua(IDGiaoDich,NhaMang,MenhGia) VALUES(${IDGiaoDich},'${nhamang}',${menhgia})`, (err,result)=>{
                                        if(err){
                                            console.log(err)
                                        }
                                    })
                                }

                                return res.send(JSON.stringify({code: 200, IDGiaoDich: IDGiaoDich}))
                            }
                        })
                    }
            }
        })
    }
}

module.exports = new muathe