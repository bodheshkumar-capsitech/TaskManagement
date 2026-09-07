import{r as e}from"./rolldown-runtime-hePW80VL.js";import{Dn as t,Gn as n,Qn as r,er as i,kn as a,qn as o,t as s,wn as c}from"./Button-BH7RVq-n.js";import{d as l,r as u}from"./useId-CnyBrcZo.js";import{r as d,t as f}from"./Card-HMZbXYK8.js";import{t as p}from"./Field-D2AKbBoM.js";import{t as m}from"./Spinner-CnTUIQr8.js";import{G as h,n as g}from"./index-COwVhbtS.js";import{t as _}from"./square-check-big-n6MHq-o2.js";var v=e(i(),1),y=e(c(),1),b=e=>{let[i,c]=(0,v.useState)(``),[b,x]=(0,v.useState)(``),[S,C]=(0,v.useState)(void 0),[w,T]=(0,v.useState)(void 0),E=l(),D=t(),{loginUser:O}=g();(0,v.useEffect)(()=>{(async()=>{try{(await a()).authenticated&&E(`/Dashboard`)}catch{console.log(`User is not authenticated`)}})()},[E]);let k=async e=>{if(e.preventDefault(),C(void 0),T(void 0),i.trim()?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i)||C(`Please enter a valid email address`):C(`Email is required`),!b.trim()){T(`Password is required`);return}if(b.length<=5){T(`Password must be atleast 6 character long...`);return}A.mutate({email:i,password:b})},A=u({mutationFn:async({email:e,password:t})=>await n(e,t),onSuccess:e=>{N(e.email,e.userName,e.role),O(),c(``),x(``),r.dismiss(),r.success(`Login sucessfull`),E(`/Dashboard`)},onError:()=>{r.dismiss(),r.error(`Invalid credential`)}}),j=u({mutationFn:async({email:e,password:t})=>await o(e,t),onSuccess:e=>{e?(c(``),x(``),r.dismiss(),r.success(`User registered successfully`)):e===!1&&(r.dismiss(),r.info(`User already registered`))},onError:()=>{r.dismiss(),r.info(`User already registered`)}}),M=async e=>{if(e.preventDefault(),C(void 0),T(void 0),!i.trim()){C(`Email is required`);return}if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i)){C(`Please enter a valid email address`);return}if(!b.trim()){T(`Password is required`);return}j.mutate({email:i,password:b})},N=(e,t,n)=>{D(h({email:e,username:t,role:n}))};return(0,y.jsxs)(`div`,{className:`min-h-screen bg-gradient-to-br from-slate-50 via-[#f5f6fa] to-[#eef2ff] flex flex-col items-center justify-center px-4 py-8`,children:[(0,y.jsxs)(`div`,{className:`flex flex-col items-center mb-9`,children:[(0,y.jsx)(`div`,{className:`w-12 h-12 rounded-xl bg-[#4F46E5] flex items-center justify-center shadow-sm`,children:(0,y.jsx)(_,{size:22,className:`text-white`})}),(0,y.jsx)(`h1`,{className:`text-[20px] font-bold text-gray-900 mt-3`,children:`TaskFlow`}),(0,y.jsx)(`p`,{className:`text-[13px] text-[#64748b] mt-1`,children:`Project Management Platform`})]}),(0,y.jsxs)(f,{className:`w-full\r
        max-w-[382px]\r
        bg-white\r
        !rounded-2xl\r
        shadow-[0_8px_30px_rgba(15,23,42,0.08)]\r
        border-0\r
        p-8\r
        `,children:[(0,y.jsxs)(`div`,{className:`m-4`,children:[(0,y.jsx)(`h2`,{className:`text-[22px] font-bold text-gray-900`,children:`Welcome back`}),(0,y.jsx)(`p`,{className:`text-[14px] text-[#64748b] mt-1`,children:`Sign in to manage your projects and tasks`})]}),(0,y.jsx)(`form`,{onSubmit:e=>{e.preventDefault(),k(e)},children:(0,y.jsxs)(`div`,{className:`flex flex-col gap-5 m-4`,children:[(0,y.jsx)(p,{label:`Email address`,validationState:S?`error`:void 0,validationMessage:S,children:(0,y.jsx)(d,{className:`w-full !rounded-xl`,size:`large`,placeholder:`Enter your email`,value:i,onChange:(e,t)=>{c(t.value),t.value.trim()&&C(void 0)}})}),(0,y.jsx)(p,{label:`Password`,validationState:w?`error`:void 0,validationMessage:w,children:(0,y.jsx)(d,{className:`w-full !rounded-xl`,size:`large`,type:`password`,placeholder:`Enter your password`,value:b,onChange:(e,t)=>{x(t.value),t.value.trim()&&T(void 0)}})}),(0,y.jsx)(`div`,{className:`flex items-center justify-between -mt-1`,children:(0,y.jsx)(`button`,{type:`button`,className:`\r
                text-[14px]\r
                text-[#4F46E5]\r
                font-medium\r
                hover:underline\r
                bg-transparent\r
                border-0\r
                cursor-pointer\r
              `,onClick:()=>{},children:`Forgot password?`})}),(0,y.jsx)(s,{appearance:`primary`,size:`large`,type:`submit`,disabled:A.isPending,className:`\r
              w-full\r
              h-10\r
             !rounded-2xl\r
              !bg-[#4F46E5]\r
              hover:!bg-[#4338ca]\r
              font-semibold\r
            `,children:A.isPending?(0,y.jsxs)(y.Fragment,{children:[` `,(0,y.jsx)(m,{size:`tiny`}),` Signin...`]}):`Sign in`}),(0,y.jsxs)(`div`,{className:`text-center text-[14px] text-[#64748b] mt-0 mb-4`,children:[`Don't have an account?`,` `,(0,y.jsx)(`button`,{type:`button`,onClick:M,disabled:j.isPending,className:`\r
                text-[#4F46E5]\r
                font-medium\r
                hover:underline\r
                bg-transparent\r
                border-0\r
                p-0\r
                cursor-pointer\r
              `,children:j.isPending?`Creating account ...`:`Create account`})]})]})})]}),(0,y.jsxs)(`p`,{className:`text-[12px] text-[#94a3b8] mt-6 text-center`,children:[`By signing in, you agree to our`,` `,(0,y.jsx)(`button`,{type:`button`,className:`hover:underline`,children:`Terms of Service`}),` `,`and`,` `,(0,y.jsx)(`button`,{type:`button`,className:`hover:underline`,children:`Privacy Policy`}),`.`]})]})};export{b as default};