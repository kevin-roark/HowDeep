(function(){var a=Handlebars.template,b=Handlebars.templates=Handlebars.templates||{};b.similar_artists=a(function(a,b,c,d,e){function k(a,b){var d="",e;return d+='\n        <li>\n          <div class="similar-img" style="background: url(',(e=c.image)?e=e.call(a,{hash:{},data:b}):(e=a.image,e=typeof e===h?e.apply(a):e),d+=i(e)+') no-repeat;"></div>\n          <a href="#" class="artist">',(e=c.name)?e=e.call(a,{hash:{},data:b}):(e=a.name,e=typeof e===h?e.apply(a):e),d+=i(e)+"</a>\n        </li>\n      ",d}this.compilerInfo=[4,">= 1.0.0"],c=this.merge(c,a.helpers),e=e||{};var f="",g,h="function",i=this.escapeExpression,j=this;f+='<!--div class="unit two-of-five">\n  <div class="similar-artists-label">\n    Similar artists:\n  </div>\n</div>\n\n<div class="unit span-grid">\n  <div class="well similar-artists">\n    <ul class="artist-list">\n      ',g=c.each.call(b,b.similars,{hash:{},inverse:j.noop,fn:j.program(1,k,e),data:e});if(g||g===0)f+=g;return f+='\n    </ul>\n  </div>\n</div>\n\n-->\n<div class="similar-img" style="background: url(',(g=c.image)?g=g.call(b,{hash:{},data:e}):(g=b.image,g=typeof g===h?g.apply(b):g),f+=i(g)+') no-repeat;"></div>\n<span class="artist">',(g=c.name)?g=g.call(b,{hash:{},data:e}):(g=b.name,g=typeof g===h?g.apply(b):g),f+=i(g)+"</a>",f}),b.main_artist=a(function(a,b,c,d,e){this.compilerInfo=[4,">= 1.0.0"],c=this.merge(c,a.helpers),e=e||{};var f="",g,h="function",i=this.escapeExpression;return f+='<div class="unit span-grid" id="star-artist">\n\n  <div class="main-artist-name">\n    ',(g=c.name)?g=g.call(b,{hash:{},data:e}):(g=b.name,g=typeof g===h?g.apply(b):g),f+=i(g)+'\n  </div>\n\n  <div class="main-artist-stats">\n    ',(g=c.listeners)?g=g.call(b,{hash:{},data:e}):(g=b.listeners,g=typeof g===h?g.apply(b):g),f+=i(g)+'\n  </div>\n\n  <div class="artist-img" style="background: url(',(g=c.image)?g=g.call(b,{hash:{},data:e}):(g=b.image,g=typeof g===h?g.apply(b):g),f+=i(g)+') no-repeat;"></div>\n\n</div>\n',f})})()