'use strict';
(() => {
  const places = {
    stairs: { number:'01', category:'일상의 기억 · 40계단', title:'계단에 남아 있는 하루', intro:'평범한 계단에 머물러 있는, 평범하지 않았던 삶의 이야기.', quote:'“누군가는 이 계단을 오르며 하루를 시작했고, 누군가는 이곳에서 소중한 사람을 기다렸대.”', history:'40계단 일대는 한국전쟁 당시 피란민들의 생활 터전이자 만남의 장소였습니다.\n\n계단을 오가며 일하고 가족을 기다리던 일상은 오늘날 거리의 조형물에도 담겨 있습니다.', activity:'화면 너머 여행 제안: 계단 주변 조형물을 천천히 살펴보세요. 어떤 하루의 모습이 담겨 있는지 신더와 함께 찾아보는 건 어떨까요?', visit:'40계단과 주변 문화관광 테마거리를 걸으며 조형물을 찾아보세요.\n\n실내 전시 관람을 계획한다면 40계단문화관의 최신 운영 정보를 먼저 확인해 주세요.', course:'추천 연결: 40계단 → 원도심 골목 산책 → 주변 전시 공간', source:'https://www.busan.go.kr/news/snsbusan05/view?dataNo=62620&gugun=Prev', sourceName:'부산시 · 40계단의 역사', search:'부산 40계단' },
    books: { number:'02', category:'책장 속 기억 · 보수동', title:'책갈피 사이의 작은 불빛', intro:'오래된 책 한 권이, 새로운 여행의 시작이 됩니다.', quote:'“이 책의 첫 번째 주인은 어떤 사람이었을까? 오늘 네가 고른 한 페이지도 언젠가 기억이 되겠지.”', history:'이 에피소드는 보수동 책방골목을 배경으로 한 창작 이야기입니다.\n\n신더는 오래된 책에 남은 가상의 메모를 발견하고, 여행자와 함께 자신만의 한 문장을 찾아 나섭니다.', activity:'여행 미션 제안: 마음에 드는 책 제목 하나를 골라 기억해 보세요. 책방마다 서로 다른 분위기와 책의 표정을 발견할 수 있을 거예요.', visit:'보수동 책방골목에서 책과 골목 풍경을 함께 만나보세요.\n\n서점별 영업시간이 다를 수 있으므로 방문 전 확인하고, 매장 안의 촬영은 책방에 먼저 문의해 주세요.', course:'추천 연결: 책방골목 둘러보기 → 책 한 권 고르기 → 주변에서 쉬어가기', source:null, search:'부산 보수동 책방골목' },
    bridge: { number:'03', category:'만남의 기억 · 영도다리', title:'영도다리에 남겨진 편지', intro:'바다 위를 잇는 다리, 그리고 사람과 사람을 잇는 기억.', quote:'“이 다리는 바다의 양쪽만 이어준 게 아니었나 봐. 누군가를 다시 만날 수 있다는 마음도 이어주었대.”', history:'영도다리는 한국전쟁 당시 피란 중 헤어진 가족을 다시 만나기를 바라던 사람들이 모여든 장소였습니다.\n\n오늘의 항구 풍경에 그 시절의 기다림을 겹쳐 보세요.', activity:'창작 이야기: 신더는 다리 근처에서 주소가 지워진 편지 한 통을 발견합니다. 편지의 주인공은 가상의 인물이며, 편지는 역사적 실물이 아닙니다.\n\n당신이라면 오늘의 부산에서 어떤 안부를 전하고 싶나요?', visit:'영도다리와 주변 수변 공간에서 항구 풍경을 감상해 보세요.\n\n도개행사 관람을 원한다면 부산시 공식 안내에서 최신 일정과 현장 상황을 확인해 주세요.', course:'추천 연결: 영도다리 → 유라리광장 → 남포동 주변 산책', source:'https://www.busan.go.kr/wartime_capital/busanheritage10', sourceName:'부산시 · 피란수도 부산유산 영도다리', search:'부산 영도대교' }
  };
  Object.assign(places, window.CINDER_TODAY_PLACES || {});
  const visuals = window.CINDER_VISUALS || {};
  const $ = selector => document.querySelector(selector);
  function paragraphs(text, className='') {
    const escape = value => value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    return String(text).split(/\n\s*\n/).map(part=>part.trim()).filter(Boolean).map(part=>`<p${className?` class="${className}"`:''}>${escape(part)}</p>`).join('');
  }
  function activitySection(text) {
    const label=text.match(/^([^:]+):\s*/);
    return `<section class="prose-block activity-block"><h3>${label?label[1]:'신더의 여행 제안'}</h3>${paragraphs(label?text.slice(label[0].length):text)}</section>`;
  }
  function setCharacter(selector,key) { const visual=visuals[key]; if(!visual)return; const image=$(selector); image.src=visual.src; image.alt=visual.alt; }
  let activeEra = 'memory';
  const eraPlaces = () => Object.keys(places).filter(id => Boolean(places[id].modern) === (activeEra === 'today'));
  const story = $('#story-dialog');
  const info = $('#info-dialog');
  let current = 'bridge';
  let memories = new Set();
  try { const saved = JSON.parse(localStorage.getItem('cinder-memories-v1') || '[]'); if (Array.isArray(saved)) memories = new Set(saved.filter(id => Object.hasOwn(places,id))); } catch {}
  let toastTimer;
  let returnFocus;
  function toast(message) { $('#toast').textContent=message; $('#toast').classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3500); }
  function updateProgress() {
    const ids=eraPlaces(), count=ids.filter(id=>memories.has(id)).length;
    $('#memory-count').textContent=count; $('#nav-count').textContent=memories.size;
    $('#memory-total').textContent=` / ${ids.length}`;
    $('#progress-fill').style.width=`${count/ids.length*100}%`;
    document.querySelectorAll('.landmark').forEach(button=>button.classList.toggle('discovered',memories.has(button.dataset.place)));
    $('#collect').textContent=memories.has(current)?'간직한 기억 ✓':'이 기억 간직하기 ✦'; $('#collect').disabled=memories.has(current);
  }
  function save() { try { localStorage.setItem('cinder-memories-v1',JSON.stringify([...memories])); } catch { toast('이 브라우저에서는 기록을 저장할 수 없어 현재 화면에서만 유지됩니다.'); } }
  function openDialog(dialog) { returnFocus=document.activeElement; dialog.showModal(); }
  function openPlace(id) {
    if (!Object.hasOwn(places,id)) return;
    if (info.open) info.close();
    current=id; const place=places[id];
    setCharacter('#story-character',id); $('#story-character-caption').textContent=visuals[id]?.caption || ''; $('#story-category').textContent=place.category; $('#story-title').textContent=place.title; $('#story-intro').textContent=place.intro; $('.banner-number').textContent=place.number;
    story.classList.toggle('modern-story',Boolean(place.modern));
    $('#tab-memory').textContent=place.modern?'소개와 대표 이야기':'기억 속 이야기';
    $('#tab-visit').textContent=place.modern?'여행 포인트':'오늘의 여행';
    renderTab('memory'); updateProgress(); if(!story.open) openDialog(story);
  }
  function renderTab(tab) {
    const place=places[current]; document.querySelectorAll('[data-tab]').forEach(button=>{ const active=button.dataset.tab===tab; button.setAttribute('aria-selected',String(active)); button.tabIndex=active?0:-1; });
    $('#story-panel').setAttribute('aria-labelledby',`tab-${tab}`);
    if(tab==='memory') {
      const sources=place.sources||(place.source?[[place.sourceName,place.source]]:[]);
      $('#story-panel').innerHTML=`<blockquote class="story-quote">${paragraphs(place.quote)}</blockquote><section class="prose-block"><h3>${place.modern?'장소 소개':'장소의 이야기'}</h3>${paragraphs(place.history)}</section>${(place.highlights||[]).map(([title,text])=>`<section class="story-highlight prose-block"><h3>${title}</h3>${paragraphs(text)}</section>`).join('')}${activitySection(place.activity)}<aside class="story-notes" aria-label="콘텐츠 안내">${paragraphs('신더의 대사와 여행 미션은 창작입니다.'+(sources.length?' 소개와 역사 해설은 아래 공식 자료를 참고했습니다.':'')+'\n\n‘발견한 기억’은 방문 인증이 아닌 읽은 이야기의 기록입니다.','content-note')}</aside>${sources.length?`<section class="source-list" aria-label="공식 참고 자료"><h3>공식 참고 자료</h3>${sources.map(([name,url])=>`<a class="source-link source-row" href="${url}" target="_blank" rel="noopener noreferrer">${name} ↗</a>`).join('')}</section>`:''}`;
    } else $('#story-panel').innerHTML=`<section class="prose-block"><h3>방문 안내</h3>${paragraphs(place.visit)}</section><section class="story-highlight prose-block"><h3>추천 연결 코스</h3>${paragraphs(place.course.replace('추천 연결: ',''))}</section><a class="source-link" href="https://map.naver.com/p/search/${encodeURIComponent(place.search)}" target="_blank" rel="noopener noreferrer">네이버 지도에서 위치 보기 ↗</a><aside class="story-notes" aria-label="여행 참고사항">${paragraphs('지도와 공식 자료 링크만 인터넷 연결이 필요합니다.\n\n코스는 이동 시간·경사도·영업 여부를 확인해 조정해 주세요.','content-note')}</aside>`;
  }
  function openInfo(title,html) { const character=title==='내가 밝힌 부산의 기억'?'archive':'guide'; setCharacter('#info-character',character); $('#info-character-caption').textContent=visuals[character]?.caption || ''; if(story.open) story.close(); $('#info-title').textContent=title; $('#info-content').innerHTML=html; if(!info.open) openDialog(info); }
  document.querySelectorAll('[data-place]').forEach(button=>button.addEventListener('click',()=>openPlace(button.dataset.place)));
  $('#start').addEventListener('click',()=>openPlace(eraPlaces().find(id=>!memories.has(id))||eraPlaces()[0]));
  $('#help').addEventListener('click',()=>openInfo('신더와 여행하는 방법',`<ol class="steps"><li><strong>두 가지 부산 지도를 만나보세요</strong><p>‘기억 속 부산’은 역사 장소 3곳을 보여줍니다.</p><p>‘오늘의 부산’은 현대 관광 명소 5곳을 보여줍니다.</p></li><li><strong>지도 위의 장소를 골라보세요</strong><p>역사 이야기 또는 명소 소개와 대표 이야기가 열립니다.</p></li><li><strong>마음에 남는 이야기를 간직하세요</strong><p>‘이 기억 간직하기’를 누르면 나의 기록에 저장됩니다.</p></li><li><strong>실제 부산 여행을 준비해 보세요</strong><p>여행 탭에서 방문 아이디어와 지도 연결을 확인하세요.</p></li></ol>`));
  document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
  [story,info].forEach(dialog=>{dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});dialog.addEventListener('close',()=>{returnFocus?.focus();document.querySelectorAll('[data-view]').forEach(button=>button.classList.toggle('active',button.dataset.view==='map'));});});
  document.querySelectorAll('[data-tab]').forEach(button=>{button.addEventListener('click',()=>renderTab(button.dataset.tab));button.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const next=event.key==='Home'?'memory':event.key==='End'?'visit':button.dataset.tab==='memory'?'visit':'memory';renderTab(next);$(`#tab-${next}`).focus();}});});
  $('#collect').addEventListener('click',()=>{if(memories.has(current))return;memories.add(current);save();updateProgress();toast(memories.size===Object.keys(places).length?'부산의 여덟 가지 이야기를 모두 간직했어요!':'신더와의 기억을 간직했어요 ✦');});
  function setEra(era) {
    activeEra=era; const today=era==='today';
    setCharacter('#cinder-companion',today?'guide':'archive');
    $('.hero').classList.toggle('today',today); $('.chapter').classList.toggle('today-chapter',today);
    $('.memory-landmarks').hidden=today; $('.today-landmarks').hidden=!today; $('#today-directory').hidden=!today;
    document.querySelectorAll('[data-era]').forEach(item=>{const selected=item.dataset.era===era;item.classList.toggle('selected',selected);item.setAttribute('aria-pressed',String(selected));});
    $('#era-caption').textContent=today?'다섯 관광지를 눌러 소개와 대표 이야기를 만나보세요':'불빛을 눌러 잠들어 있는 이야기를 만나보세요';
    $('.hero-copy .eyebrow').innerHTML=today?'<span>✦</span> 오늘의 부산 관광':'<span>✦</span> 부산 역사 탐험';
    $('#hero-title').innerHTML=today?'<em>신더</em>와 함께,<br>오늘의 부산을 만나다':'<em>신더</em>와 함께,<br>부산의 시간을 밝히다';
    $('.hero-description').innerHTML=paragraphs(today?'영화가 흐르고, 바다와 도시가 만나는 곳.\n\n부산의 대표 명소와 이야기를 발견해 보세요.':'골목에 남은 이야기를 따라 떠나는 부산 여행.\n\n작은 불씨 하나로, 도시의 기억이 깨어납니다.');
    $('#start').innerHTML=today?'오늘의 명소 둘러보기 <span>↗</span>':'기억 탐험 시작하기 <span>↗</span>';
    $('.speech').innerHTML=today?'지금의 부산에는<br>어떤 이야기가 있을까?<span>너의 여행 친구, 신더</span>':'이 도시의 기억을<br>함께 찾아볼래?<span>너의 여행 친구, 신더</span>';
    $('#chapter-label').textContent=today?'✦ 오늘의 추천 명소':'✦ 첫 번째 이야기';
    $('#chapter-title').textContent=today?'영화의전당에서 만나는 BIFF':'영도다리에 남겨진 편지';
    $('#chapter-description').textContent=today?'빅루프 아래에서 시작하는 영화도시 부산 이야기.':'다리 위에 남아 있는 만남의 기억을 찾아보세요.';
    $('#chapter-open').dataset.place=today?'cinema':'bridge'; $('#progress-label').textContent=today?'발견한 명소':'발견한 기억';
    $('.chapter-image span').textContent=today?'CINEMA & CITY':'CHAPTER 01';
    updateProgress();
  }
  document.querySelectorAll('[data-era]').forEach(button=>button.addEventListener('click',()=>setEra(button.dataset.era)));
  document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{
    const view=button.dataset.view;
    if(view==='map'){ $('#map').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}); return; }
    if(view==='routes') openInfo(activeEra==='today'?'오늘의 부산, 다섯 가지 여행':'기억 속 부산, 세 가지 산책',eraPlaces().map(id=>{const p=places[id];return `<button class="route-item" data-open-place="${id}"><strong>${p.modern?p.title:p.category.split(' · ').reverse().join(' · ')}</strong><span>${p.course.replace('추천 연결: ','')} ↗</span></button>`;}).join('')+`<div class="info-note prose-note">${paragraphs('각 코스는 개별 산책 제안입니다.\n\n모든 장소를 하나의 연속 도보 코스로 구성한 안내가 아닙니다.')}</div>`);
    if(view==='collection') openInfo('내가 밝힌 부산의 기억',memories.size?[...memories].map(id=>`<button class="collection-item" data-open-place="${id}"><img class="collection-thumb" src="${visuals[id]?.src || 'assets/cinder.png'}" alt="" width="74" height="55" loading="lazy"><strong>✦ ${places[id].title}</strong><span>${places[id].category} · 기억 다시 보기 →</span></button>`).join('')+'<button class="reset" id="reset-memories">기록 초기화</button>':'<div class="empty"><span>✧</span>아직 발견한 기억이 없어요.<br>지도 위의 작은 불빛에서 여행을 시작해 보세요.</div><button class="button button-primary" data-open-place="bridge">첫 번째 이야기 만나기 →</button>');
    document.querySelectorAll('[data-view]').forEach(item=>item.classList.toggle('active',item===button));
  }));
  $('#info-content').addEventListener('click',event=>{const target=event.target.closest('[data-open-place]');if(target)openPlace(target.dataset.openPlace);if(event.target.id==='reset-memories'&&confirm('이 브라우저에 저장한 모든 장소의 기억 기록을 초기화할까요?')){memories.clear();save();updateProgress();info.close();toast('기록을 초기화했어요. 새로운 마음으로 떠나볼까요?');}});
  let audioContext,master,nodes=[];
  $('#sound-toggle').addEventListener('click',async()=>{
    const button=$('#sound-toggle'); const playing=button.getAttribute('aria-pressed')==='true';
    if(playing){button.setAttribute('aria-pressed','false');button.setAttribute('aria-label','배경음 켜기');button.title='배경음 켜기';if(audioContext)await audioContext.suspend();return;}
    try {if(!audioContext){const Audio=window.AudioContext||window.webkitAudioContext;audioContext=new Audio();master=audioContext.createGain();master.gain.value=.025;master.connect(audioContext.destination);[174.61,261.63,349.23,440].forEach((frequency,index)=>{const oscillator=audioContext.createOscillator(),gain=audioContext.createGain();oscillator.type='sine';oscillator.frequency.value=frequency;gain.gain.value=[.45,.25,.12,.08][index];oscillator.connect(gain);gain.connect(master);oscillator.start();nodes.push(oscillator);});}await audioContext.resume();button.setAttribute('aria-pressed','true');button.setAttribute('aria-label','배경음 끄기');button.title='배경음 끄기';toast('작은 불빛을 닮은 잔잔한 배경음을 켰어요.');}catch{toast('이 브라우저에서는 배경음을 재생할 수 없어요.');}
  });
  updateProgress();
})();
