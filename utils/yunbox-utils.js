export function localfileURL(sanityMainImage){
  if(sanityMainImage != undefined){
    return `/images/${sanityMainImage.asset._ref.replace('image-', '').replace('-jpg', '')}.jpg`
  }else{
    return '';
  }
}