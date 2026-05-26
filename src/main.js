const state = {
  documents: [],
  selectedDoc: null,
  inDocSearchQuery: "",
  currentSearchIndex: 0,
};

// Elements
const readingView = document.getElementById("reading-view");
const textContainer = document.getElementById("text-container");

// Reading Mode Elements
const readDocTitle = document.getElementById("read-doc-title");
const readDocAuthor = document.getElementById("read-doc-author");
const docSearchInput = document.getElementById("doc-search-input");
const docSearchClear = document.getElementById("doc-search-clear");

// Initialize application
async function initApp() {
  await fetchIndex();
  setupEventListeners();
  
  if (state.documents.length > 0) {
    openReadingMode(state.documents[0].id);
  }
}

// Fetch documents list
async function fetchIndex() {
  try {
    // Fetch the index list of documents with cache busting
    const response = await fetch(`/data/index.json?v=${new Date().getTime()}`);
    if (!response.ok) throw new Error("Failed to load documents list index");
    state.documents = await response.json();
  } catch (e) {
    console.error("Fetch index error:", e);
    textContainer.innerHTML = `
      <div class="py-16 text-center text-red-500 font-medium">
        Gagal memuat koleksi perpustakaan. Pastikan server dev berjalan.
      </div>
    `;
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // In-document Word Search Input
  docSearchInput.addEventListener("input", (e) => {
    state.inDocSearchQuery = e.target.value;
    state.currentSearchIndex = 0; // Reset index when query changes
    if (state.inDocSearchQuery.length > 0) {
      docSearchClear.classList.remove("hidden");
    } else {
      docSearchClear.classList.add("hidden");
    }
    renderDocumentText();
  });

  // Handle Enter key for finding next match
  docSearchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && state.inDocSearchQuery.length > 0) {
      e.preventDefault();
      scrollToNextMatch();
    }
  });

  // Clear In-document Search
  docSearchClear.addEventListener("click", () => {
    docSearchInput.value = "";
    state.inDocSearchQuery = "";
    state.currentSearchIndex = 0;
    docSearchClear.classList.add("hidden");
    renderDocumentText();
  });

  // Sidebar Menu click behavior
  document.querySelectorAll(".sidebar-doc-link").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const docId = link.getAttribute("data-doc-id");
      if (docId) openReadingMode(docId);
    });
  });
}

// Open Reading Mode View
async function openReadingMode(docId) {
  try {
    readingView.classList.remove("hidden");
    readingView.classList.add("flex");

    readDocTitle.textContent = "Loading...";
    readDocAuthor.textContent = "";
    textContainer.innerHTML = `<div class="py-16 text-center text-stone-400 font-medium">Memuat isi dokumen...</div>`;

    // Fetch complete document details
    const response = await fetch(`/data/${docId}.json?v=${new Date().getTime()}`);
    if (!response.ok) throw new Error("Gagal mengambil teks dokumen lengkap");
    const docData = await response.json();

    state.selectedDoc = docData;
    readDocTitle.textContent = docData.title;
    readDocAuthor.textContent = `Oleh ${docData.author}`;

    // Update active state navigation sidebar highlight
    updateSidebarActiveState(docId);

    // Reset search
    state.inDocSearchQuery = "";
    state.currentSearchIndex = 0;
    docSearchInput.value = "";
    docSearchClear.classList.add("hidden");

    // Render text
    renderDocumentText();
    textContainer.scrollTop = 0;
  } catch (e) {
    console.error("Open reading mode error:", e);
    textContainer.innerHTML = `
      <div class="py-16 text-center text-red-500 font-medium">
        Gagal memuat teks lengkap. Pastikan server dev berjalan dengan lancar.
      </div>
    `;
  }
}

// Update Active Styling for Sidebar Links
function updateSidebarActiveState(activeId) {
  // Document links active styling
  document.querySelectorAll(".sidebar-doc-link").forEach(link => {
    const docId = link.getAttribute("data-doc-id");
    const svg = link.querySelector("svg");
    
    if (docId === activeId) {
      link.classList.add("text-stone-900", "bg-[#f5efe6]", "font-medium");
      link.classList.remove("text-stone-500", "hover:text-stone-900", "hover:bg-stone-100/50");
      if (svg) {
        svg.classList.remove("text-stone-400");
        svg.classList.add("text-stone-700");
      }
    } else {
      link.classList.remove("text-stone-900", "bg-[#f5efe6]", "font-medium");
      link.classList.add("text-stone-500", "hover:text-stone-900", "hover:bg-stone-100/50");
      if (svg) {
        svg.classList.remove("text-stone-700");
        svg.classList.add("text-stone-400");
      }
    }
  });
}

// Render PDF text page text with highlight support
function renderDocumentText() {
  if (!state.selectedDoc) return;

  // 1. Join all pages
  let rawText = state.selectedDoc.pages.map(p => p.text).join("\n\n");

  // 2. Parse markdown to HTML
  let formattedHtml = marked.parse(rawText);

  // In-document Word Search Highlight (run on string before DOM insertion)
  if (state.inDocSearchQuery.trim().length > 0) {
    const query = escapeRegExp(state.inDocSearchQuery.trim());
    const regex = new RegExp(`(?![^<]+>)(${query})`, "gi");
    formattedHtml = formattedHtml.replace(regex, `<mark class="bg-amber-100 text-stone-900 px-0.5 rounded border-b border-amber-400">$1</mark>`);
  }

  // Insert HTML to DOM
  textContainer.innerHTML = formattedHtml;

  // 3. Post-process HTML via DOM to center specific elements requested by the user
  // Center all H1 tags (Main titles)
  textContainer.querySelectorAll('h1').forEach(el => el.style.textAlign = 'center');

  // Center specific target strings (Author names and ABSTRAK)
  const centerStrings = [
    "FERRY IRWANDI",
    "Oleh Ferry Irwandi",
    "ABSTRAK",
    "PERHITUNGAN REFORMASI SUBSIDI INDONESIA",
    "DARI UNIVERSAL KE TARGETED",
    "Cost Effectiveness Analysis MBG"
  ];

  textContainer.querySelectorAll('p, h2, h3, h4, h5, h6').forEach(el => {
    centerStrings.forEach(str => {
      // Check if text content exactly includes the target string
      if (el.textContent.trim().toLowerCase().includes(str.toLowerCase())) {
        // Use inline styles because Tailwind 'prose-p:text-justify' has higher CSS specificity than '.text-center'
        el.style.textAlign = 'center';
      }
    });
  });
}

// Helper to escape regex special characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Scroll to the next search match
function scrollToNextMatch() {
  const marks = textContainer.querySelectorAll("mark");
  if (marks.length === 0) return;

  // Remove active styling from all marks
  marks.forEach(m => {
    m.classList.remove("bg-amber-300", "ring-2", "ring-amber-500", "shadow-sm");
    m.classList.add("bg-amber-100");
  });

  // Ensure index is within bounds
  if (state.currentSearchIndex >= marks.length) {
    state.currentSearchIndex = 0;
  }

  const activeMark = marks[state.currentSearchIndex];
  
  // Add active styling for visual focus
  activeMark.classList.remove("bg-amber-100");
  activeMark.classList.add("bg-amber-300", "ring-2", "ring-amber-500", "shadow-sm");

  // Scroll smoothly into view, centering the highlight
  activeMark.scrollIntoView({ behavior: "smooth", block: "center" });

  // Increment for next enter press
  state.currentSearchIndex++;
}

// Run app
document.addEventListener("DOMContentLoaded", initApp);
export { state, initApp };
