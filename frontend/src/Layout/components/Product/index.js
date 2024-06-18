// function ProductComponent() {
//   return ( {dataForm.map((items) => (
//     <>
//       <div className="w-full h-3/5 flex bg-white">
//         <div className="w-2/5 px-3">
//           <div className="aspect-square">
//             <SliderProduct data={items.imageSlider} />
//           </div>
//         </div>
//         <div className="w-3/5 px-3 py-7 text-sm text-black/60">
//           <div className="pb-3">
//             <div className="text-sm text-black/90">{items.name}</div>
//             <div className="text-xs text-black/50">SKU: {items._id}</div>
//           </div>
//           <div
//             className="w-full h-28 p-3 text-sm  flex-col mb-5"
//             style={{ backgroundImage: `url('${bgproduct}')` }}
//           >
//             <div className="w-full flex items-center">
//               <div className="w-1/4">Giá Gốc:</div>
//               <div className="w-3/4 line-through">{items.price}</div>
//             </div>
//             <div className="w-full flex items-center pb-1 border-b">
//               <div className="w-1/4">Giá khuyến mãi:</div>
//               <div className="w-3/4 text-red-600 text-base">
//                 {handleCalcSale(items.price, items.discount)}
//               </div>
//             </div>
//             <div className="w-full flex items-center my-auto">
//               <div className="w-1/4">Trong kho còn:</div>
//               <div className="w-3/4 ">{items.quantity}</div>
//             </div>
//           </div>
//           <div className="Loại/Size">
//             <div className="w-full flex items-center my-4">
//               <div className="w-1/4">Loại/Size:</div>
//               <div className="w-3/4">
//                 {items.type.split(";").map((it, FontAwesomeIcon) => (
//                   <Button
//                     className={`py-1 px-3 border rounded-md mr-1 ${
//                       btnActive === FontAwesomeIcon
//                         ? "bg-sky-500 text-white"
//                         : null
//                     }`}
//                     text={it}
//                     onClick={(e) => setBtnActive(FontAwesomeIcon)}
//                   />
//                 ))}
//               </div>
//             </div>

//             <div className="w-full flex items-center my-4">
//               <div className="w-1/4">Số lượng:</div>
//               <div className="w-3/4">
//                 <div className="w-24 h-8 flex justify-center items-center border">
//                   <div
//                     className="h-full w-1/3 flex justify-center items-center text-2xl cursor-pointer hover:bg-black/20 border-r"
//                     onClick={(e) => handleQuantity("-")}
//                   >
//                     -
//                   </div>
//                   <div className="h-full w-1/3 flex justify-center items-center text-base border-r text-black">
//                     {quantity}
//                   </div>
//                   <div
//                     className="h-full w-1/3 flex justify-center items-center text-2xl cursor-pointer hover:bg-black/20"
//                     onClick={(e) => handleQuantity("+")}
//                   >
//                     +
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="w-full pt-14">
//               <Button
//                 className="px-3 py-2 bg-rose-600 text-white hover:bg-rose-600/60 shadow-lg"
//                 text=" THÊM VÀO GIỎ HÀNG +"
//                 id={items._id}
//                 onClick={(e) => handleSubmitForm()}
//               >
//                 {" "}
//                 <FontAwesomeIcon icon="fa-solid fa-cart-plus" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="text-black h-11 flex text-lg font-bold">
//         <div className="w-1/3 h-full flex items-center pl-5">Mô tả</div>
//         <div className="w-2/3 h-full flex items-center pl-5">
//           Thông tin
//         </div>
//       </div>
//       <div className="w-full h-auto bg-white flex pb-8">
//         <div className="w-1/3 h-full py-3 px-5">
//           <div className="text-black text-base font-bold">
//             {items.name}
//           </div>
//           <div className="text-black/80 text-justify">
//             {items.describe}
//           </div>
//         </div>
//         <div className="w-2/3 h-full py-3 px-5">
//           <div className="w-full flex text-black/70 pb-2 border-b">
//             <div className="w-1/3">Xuất xứ</div>
//             <div className="w-2/3">{items.origin}</div>
//           </div>
//         </div>
//       </div>
//     </>
//   ))} );
// }

// export default ProductComponent;
