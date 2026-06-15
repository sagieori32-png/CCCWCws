// =========================================================
//  CCCWC site app
//  Renders dynamic content (members, teams, news), supports
//  inline edit-mode with localStorage persistence, and lets
//  users export / import / reset content as JSON.
// =========================================================

(function () {
  'use strict';

  const STORAGE_KEY = 'cccwc_site_v1';

  // -------- state --------
  let state = loadState();
  let editing = false;

  // -------- helpers --------
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);

        // ---- BACKFILL ----
        // When INITIAL_DATA is updated (e.g. emails added later), users with
        // existing localStorage would otherwise miss those updates. So for any
        // stored member matching an INITIAL_DATA member by id, fill any field
        // that's empty/missing in the stored version from INITIAL_DATA. User
        // edits are preserved — we only fill blanks.
        const storedMembers = Array.isArray(parsed.members) ? parsed.members : [];
        const initialById = new Map(INITIAL_DATA.members.map(m => [m.id, m]));
        const storedIds = new Set(storedMembers.map(m => m.id));

        storedMembers.forEach(m => {
          const init = initialById.get(m.id);
          if (!init) return;
          ['email', 'affiliation', 'photo', 'bio', 'name'].forEach(field => {
            if ((!m[field] || m[field] === '') && init[field]) {
              m[field] = init[field];
            }
          });
        });

        // Add any NEW members from INITIAL_DATA that aren't in stored state
        // (e.g. a new colleague added in a later version of data.js).
        INITIAL_DATA.members.forEach(im => {
          if (!storedIds.has(im.id)) {
            storedMembers.push(structuredClone(im));
          }
        });

        return {
          fresh:   Array.isArray(parsed.fresh) ? parsed.fresh : structuredClone(INITIAL_DATA.fresh),
          teams:   Array.isArray(parsed.teams) ? parsed.teams : structuredClone(INITIAL_DATA.teams),
          members: storedMembers,
          texts:   parsed.texts && typeof parsed.texts === 'object' ? parsed.texts : {}
        };
      }
    } catch (e) {
      console.warn('Could not load saved state', e);
    }
    return {
      fresh:   structuredClone(INITIAL_DATA.fresh),
      teams:   structuredClone(INITIAL_DATA.teams),
      members: structuredClone(INITIAL_DATA.members),
      texts:   {}
    };
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save state', e);
      toast('Could not save changes (storage unavailable)');
    }
  }

  function uid(prefix) {
    return prefix + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, ch => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[ch]));
  }

  function escapeAttr(str) {
    // For use inside HTML attribute values (e.g. value="...")
    return escapeHtml(str);
  }

  function toast(msg, ms = 2400) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toast._h);
    toast._h = setTimeout(() => { t.hidden = true; }, ms);
  }

  // =========================================================
  //  RENDER
  // =========================================================

  function renderAll() {
    renderTexts();
    renderFresh();
    renderTeams();
    renderMembers();
  }

  function renderTexts() {
    document.querySelectorAll('[data-edit]').forEach(el => {
      const key = el.dataset.edit;
      const type = el.dataset.type || 'text';
      if (state.texts[key] === undefined) return;
      const value = state.texts[key];

      if (type === 'list') {
        el.innerHTML = (Array.isArray(value) ? value : [])
          .map(item => `<li>${escapeHtml(item)}</li>`).join('');
      } else if (type === 'paragraphs') {
        el.innerHTML = (Array.isArray(value) ? value : [])
          .map(p => `<p>${escapeHtml(p)}</p>`).join('');
      } else {
        el.textContent = value;
      }
    });
  }

  // ---------- Fresh from the field ----------
  function renderFresh() {
    const grid = document.getElementById('freshGrid');
    grid.innerHTML = state.fresh.map(item => `
      <article class="fresh-card" data-id="${escapeAttr(item.id)}">
        <div class="card-actions">
          <button class="card-action-btn edit" title="Edit" data-action="edit-fresh" data-id="${escapeAttr(item.id)}">✎</button>
          <button class="card-action-btn delete" title="Delete" data-action="delete-fresh" data-id="${escapeAttr(item.id)}">×</button>
        </div>
        ${item.image ? `<div class="img-wrap"><img src="${escapeAttr(item.image)}" alt="${escapeAttr(item.title)}" /></div>` : ''}
        <div class="content">
          ${item.date ? `<div class="date">${escapeHtml(item.date)}</div>` : ''}
          <h3>${escapeHtml(item.title)}</h3>
          ${item.subtitle ? `<p class="subtitle">${escapeHtml(item.subtitle)}</p>` : ''}
        </div>
        ${item.link ? `<a href="${escapeAttr(item.link)}" class="card-link" aria-label="Read more about ${escapeAttr(item.title)}" style="position:absolute;inset:0;" target="_blank" rel="noopener"></a>` : ''}
      </article>
    `).join('');
  }

  // ---------- Research teams ----------
  function renderTeams() {
    const grid = document.getElementById('teamsGrid');
    grid.innerHTML = state.teams.map(t => `
      <div class="team-card" data-id="${escapeAttr(t.id)}">
        <div class="card-actions">
          <button class="card-action-btn edit" title="Edit" data-action="edit-team" data-id="${escapeAttr(t.id)}">✎</button>
          <button class="card-action-btn delete" title="Delete" data-action="delete-team" data-id="${escapeAttr(t.id)}">×</button>
        </div>
        <h3>${escapeHtml(t.title)}</h3>
        <p>${escapeHtml(t.members)}</p>
      </div>
    `).join('');
  }

  // ---------- Members ----------
  function renderMembers() {
    const grid = document.getElementById('membersGrid');
    grid.innerHTML = state.members.map(m => {
      const initial = escapeHtml((m.name || '?').charAt(0));
      const photoHtml = m.photo
        ? `<img src="${escapeAttr(m.photo)}" alt="${escapeAttr(m.name)}" onerror="this.outerHTML='<div class=&quot;photo-fallback&quot;>${initial}</div>';" />`
        : `<div class="photo-fallback">${initial}</div>`;
      const emailHtml = m.email
        ? `<a class="member-email" href="mailto:${escapeAttr(m.email)}">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
             ${escapeHtml(m.email)}
           </a>`
        : '';
      return `
        <article class="member-card" data-id="${escapeAttr(m.id)}">
          <div class="card-actions">
            <button class="card-action-btn edit" title="Edit" data-action="edit-member" data-id="${escapeAttr(m.id)}">✎</button>
            <button class="card-action-btn delete" title="Delete" data-action="delete-member" data-id="${escapeAttr(m.id)}">×</button>
          </div>
          <div class="member-photo">${photoHtml}</div>
          <div class="member-info">
            <h3 class="member-name">${escapeHtml(m.name)}</h3>
            ${m.affiliation ? `<div class="member-affil">${escapeHtml(m.affiliation)}</div>` : ''}
            <p class="member-bio collapsed">${escapeHtml(m.bio)}</p>
            <button class="read-more" type="button">Read more</button>
            ${emailHtml}
          </div>
        </article>
      `;
    }).join('');
  }

  // =========================================================
  //  EDIT MODE
  // =========================================================

  function setEditing(on) {
    editing = on;
    document.body.classList.toggle('editing', on);
    const btn = document.getElementById('editToggle');
    btn.classList.toggle('active', on);
    btn.querySelector('span').textContent = on ? 'Done' : 'Edit';
    document.getElementById('editMenu').hidden = !on;

    document.querySelectorAll('[data-edit]').forEach(el => {
      if (on) {
        el.setAttribute('contenteditable', 'true');
        el.setAttribute('spellcheck', 'true');
      } else {
        el.removeAttribute('contenteditable');
        el.removeAttribute('spellcheck');
      }
    });

    if (!on) {
      collectInlineTextEdits();
      saveState();
      toast('Changes saved');
    }
  }

  function collectInlineTextEdits() {
    document.querySelectorAll('[data-edit]').forEach(el => {
      const key = el.dataset.edit;
      const type = el.dataset.type || 'text';
      let value;
      if (type === 'list') {
        value = Array.from(el.querySelectorAll('li'))
          .map(li => li.textContent.trim())
          .filter(Boolean);
      } else if (type === 'paragraphs') {
        value = Array.from(el.querySelectorAll('p'))
          .map(p => p.textContent.trim())
          .filter(Boolean);
      } else {
        value = el.textContent.trim();
      }
      state.texts[key] = value;
    });
  }

  // =========================================================
  //  MODAL (used for adding/editing structured items)
  // =========================================================

  function openModal(title, fields, onSave) {
    const modal = document.getElementById('modal');
    document.getElementById('modalTitle').textContent = title;
    const body = document.getElementById('modalBody');

    body.innerHTML = fields.map(f => {
      const id = `mf-${f.key}`;
      const val = escapeAttr(f.value || '');
      const valTxt = escapeHtml(f.value || '');
      if (f.type === 'textarea') {
        return `<label for="${id}">${escapeHtml(f.label)}<textarea id="${id}" rows="${f.rows || 5}" placeholder="${escapeAttr(f.placeholder || '')}">${valTxt}</textarea></label>`;
      }
      if (f.type === 'image') {
        return `
          <label for="${id}">${escapeHtml(f.label)}
            <input type="text" id="${id}" placeholder="assets/portraits/example.png or paste any URL" value="${val}" />
            <input type="file" accept="image/*" id="${id}-file" style="margin-top:0.4rem;" />
            <img class="photo-preview" id="${id}-preview" src="${val || ''}" alt="" ${val ? '' : 'style="display:none;"'} />
          </label>`;
      }
      return `<label for="${id}">${escapeHtml(f.label)}<input type="text" id="${id}" placeholder="${escapeAttr(f.placeholder || '')}" value="${val}" /></label>`;
    }).join('');

    fields.forEach(f => {
      if (f.type === 'image') {
        const fileInput = document.getElementById(`mf-${f.key}-file`);
        const textInput = document.getElementById(`mf-${f.key}`);
        const preview   = document.getElementById(`mf-${f.key}-preview`);
        if (fileInput) {
          fileInput.addEventListener('change', e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
              textInput.value = reader.result;
              preview.src = reader.result;
              preview.style.display = '';
            };
            reader.readAsDataURL(file);
          });
        }
        if (textInput) {
          textInput.addEventListener('input', () => {
            preview.src = textInput.value;
            preview.style.display = textInput.value ? '' : 'none';
          });
        }
      }
    });

    modal.hidden = false;

    document.getElementById('modalSave').onclick = () => {
      const result = {};
      fields.forEach(f => {
        const el = document.getElementById(`mf-${f.key}`);
        result[f.key] = el ? el.value.trim() : '';
      });
      const ok = onSave(result);
      if (ok !== false) {
        modal.hidden = true;
        saveState();
      }
    };
    document.getElementById('modalCancel').onclick = () => { modal.hidden = true; };
  }

  function openMemberModal(id) {
    const existing = id ? state.members.find(m => m.id === id) : null;
    openModal(existing ? 'Edit member' : 'Add member', [
      { key: 'name',        label: 'Name',         type: 'text',     value: existing?.name || '',       placeholder: 'Prof. Dr. ...' },
      { key: 'affiliation', label: 'Affiliation',  type: 'text',     value: existing?.affiliation || '', placeholder: 'University, department' },
      { key: 'photo',       label: 'Photo',        type: 'image',    value: existing?.photo || '' },
      { key: 'bio',         label: 'Biography',    type: 'textarea', value: existing?.bio || '', rows: 6 },
      { key: 'email',       label: 'Email (optional)', type: 'text', value: existing?.email || '' }
    ], (data) => {
      if (!data.name) { toast('Name is required'); return false; }
      if (existing) {
        Object.assign(existing, data);
      } else {
        state.members.push({ id: uid('m'), ...data });
      }
      renderMembers();
    });
  }

  function openTeamModal(id) {
    const existing = id ? state.teams.find(t => t.id === id) : null;
    openModal(existing ? 'Edit research team' : 'Add research team', [
      { key: 'title',   label: 'Topic / Team title', type: 'text', value: existing?.title || '',   placeholder: 'e.g. Refugee Children' },
      { key: 'members', label: 'Members',            type: 'textarea', rows: 3, value: existing?.members || '', placeholder: 'Names separated by · or commas' }
    ], (data) => {
      if (!data.title) { toast('Title is required'); return false; }
      if (existing) {
        Object.assign(existing, data);
      } else {
        state.teams.push({ id: uid('team'), ...data });
      }
      renderTeams();
    });
  }

  function openFreshModal(id) {
    const existing = id ? state.fresh.find(f => f.id === id) : null;
    openModal(existing ? 'Edit news item' : 'Add news item', [
      { key: 'title',    label: 'Title',    type: 'text',     value: existing?.title || '' },
      { key: 'subtitle', label: 'Subtitle / Summary', type: 'textarea', rows: 3, value: existing?.subtitle || '' },
      { key: 'date',     label: 'Date',     type: 'text',     value: existing?.date || '', placeholder: '4 June 2025' },
      { key: 'image',    label: 'Image',    type: 'image',    value: existing?.image || '' },
      { key: 'link',     label: 'Link (optional)', type: 'text', value: existing?.link || '', placeholder: 'https://...' }
    ], (data) => {
      if (!data.title) { toast('Title is required'); return false; }
      if (existing) {
        Object.assign(existing, data);
      } else {
        state.fresh.push({ id: uid('fresh'), ...data });
      }
      renderFresh();
    });
  }

  // =========================================================
  //  EVENT WIRING
  // =========================================================

  function wire() {
    document.getElementById('editToggle').addEventListener('click', () => {
      setEditing(!editing);
    });

    document.addEventListener('click', e => {
      const rm = e.target.closest('.read-more');
      if (rm) {
        const bio = rm.parentElement.querySelector('.member-bio');
        bio.classList.toggle('collapsed');
        rm.textContent = bio.classList.contains('collapsed') ? 'Read more' : 'Show less';
      }

      const action = e.target.closest('[data-action]');
      if (action) {
        e.preventDefault();
        e.stopPropagation();
        const id = action.dataset.id;
        switch (action.dataset.action) {
          case 'edit-member':   openMemberModal(id); break;
          case 'delete-member':
            if (confirm('Remove this member?')) {
              state.members = state.members.filter(m => m.id !== id);
              saveState(); renderMembers();
            }
            break;
          case 'edit-team':   openTeamModal(id); break;
          case 'delete-team':
            if (confirm('Remove this team?')) {
              state.teams = state.teams.filter(t => t.id !== id);
              saveState(); renderTeams();
            }
            break;
          case 'edit-fresh':   openFreshModal(id); break;
          case 'delete-fresh':
            if (confirm('Remove this news item?')) {
              state.fresh = state.fresh.filter(f => f.id !== id);
              saveState(); renderFresh();
            }
            break;
        }
      }

      const addBtn = e.target.closest('[data-add]');
      if (addBtn) {
        e.preventDefault();
        switch (addBtn.dataset.add) {
          case 'member': openMemberModal(); break;
          case 'team':   openTeamModal(); break;
          case 'fresh':  openFreshModal(); break;
        }
      }
    });

    document.getElementById('modal').addEventListener('click', e => {
      if (e.target.id === 'modal') document.getElementById('modal').hidden = true;
    });

    document.getElementById('exportBtn').addEventListener('click', () => {
      collectInlineTextEdits();
      saveState();
      const data = JSON.stringify(state, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cccwc-content-${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast('Content downloaded');
    });

    document.getElementById('importBtn').addEventListener('click', () => {
      document.getElementById('importFile').click();
    });
    document.getElementById('importFile').addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          state = {
            fresh:   Array.isArray(parsed.fresh)   ? parsed.fresh   : [],
            teams:   Array.isArray(parsed.teams)   ? parsed.teams   : [],
            members: Array.isArray(parsed.members) ? parsed.members : [],
            texts:   (parsed.texts && typeof parsed.texts === 'object') ? parsed.texts : {}
          };
          saveState();
          renderAll();
          toast('Content imported');
        } catch (err) {
          toast('Could not parse JSON file');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
      if (!confirm('Reset all content to original?\nThis will discard your edits and additions.')) return;
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    });

    document.getElementById('currentYear').textContent = new Date().getFullYear();
  }

  // =========================================================
  //  INIT
  // =========================================================

  function init() {
    document.querySelectorAll('[data-edit]').forEach(el => {
      el.dataset.original = el.innerHTML;
    });
    renderAll();
    wire();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
