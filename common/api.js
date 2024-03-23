
export const baseUel="http://127.0.0.1:15087/"

export default{
    
    post(url,param){
        return new Promise((resolve,reject) =>{
            uni.request({
                method:'POST',
                url: baseUel+url,
                data: param,
                header:{
					'Content-Type': 'application/json'
				}
            }).then(res=>{
				   resolve(res[1].data)
				  reject(res)
			})
        })        
    },
}
