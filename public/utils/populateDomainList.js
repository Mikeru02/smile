export default function populateDomainListContainer(cardStyling, buttonStyling, domains) {
    return domains.map(domain => `
        <div class="${cardStyling}">
            <span>${domain.link}</span>
            <button class="${buttonStyling} remove-btn" data-id="${domain.id}">×</button>
        </div>
        `).join('');
}