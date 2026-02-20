import styles from './component.module.css';
import ILLUSTRATION1 from '../../../icons/photographer.svg';

export default function Modal() {
    const modal = `
        <div class="${styles['modal']}" id="modal">
            <div class="${styles['modal-content']}">
                <div class="${styles['modal-header']}">
                    <div class="${styles['header-icon']}">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                    <div class="${styles['header-content']}">
                        <h2 class="${styles['modal-title']}">Client Details</h2>
                        <p class="${styles['modal-subtitle']}">View and manage client information</p>
                    </div>
                </div>
                
                <div class="${styles['modal-body']}">
                    <div class="${styles['client-card']}" id="client-details">
                        <div class="${styles['detail-group']}">
                            <div class="${styles['detail-item']}">
                                <div class="${styles['detail-icon']}">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                                <div class="${styles['detail-content']}">
                                    <label class="${styles['detail-label']}">Name</label>
                                    <span class="${styles['detail-value']}" id="client-name"></span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="${styles['detail-grid']}">
                            <div class="${styles['detail-item']}">
                                <div class="${styles['detail-icon']}">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                </div>
                                <div class="${styles['detail-content']}">
                                    <label class="${styles['detail-label']}">IP Address</label>
                                    <span class="${styles['detail-value']}" id="client-ip"></span>
                                </div>
                            </div>
                            
                            <div class="${styles['detail-item']}">
                                <div class="${styles['detail-icon']}">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                </div>
                                <div class="${styles['detail-content']}">
                                    <label class="${styles['detail-label']}" for="client-status">Status</label>
                                    <select class="${styles['detail-input']} ${styles['status-select']}" id="client-status">
                                        <option value="active">Active</option>
                                        <option value="pending">Pending</option>
                                        <option value="dropping">Dropping</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div class="${styles['detail-grid']}">
                            <div class="${styles['detail-item']}">
                                <div class="${styles['detail-icon']}">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                </div>
                                <div class="${styles['detail-content']}">
                                    <label class="${styles['detail-label']}" for="client-timeRemaining">Time Remaining</label>
                                    <input type="number" class="${styles['detail-input']}" id="client-timeRemaining" min="0" step="1">
                                </div>
                            </div>
                            
                            <div class="${styles['detail-item']}">
                                <div class="${styles['detail-icon']}">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                    </svg>
                                </div>
                                <div class="${styles['detail-content']}">
                                    <label class="${styles['detail-label']}" for="client-timeEarned">Time Earned</label>
                                    <input type="number" class="${styles['detail-input']}" id="client-timeEarned" min="0" step="1">
                                </div>
                            </div>
                        </div>
                        
                        <div class="${styles['detail-grid']}">
                            <div class="${styles['detail-item']}">
                                <div class="${styles['detail-icon']}">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M9 11H3v2h6v-2zm0-4H3v2h6V7zm0 8H3v2h6v-2zm12-8h-6v2h6V7zm0 4h-6v2h6v-2zm0 4h-6v2h6v-2z"></path>
                                    </svg>
                                </div>
                                <div class="${styles['detail-content']}">
                                    <label class="${styles['detail-label']}">Waste Collected</label>
                                    <span class="${styles['detail-value']}" id="client-wasteCollected"></span>
                                </div>
                            </div>
                            
                            <div class="${styles['detail-item']}">
                                <div class="${styles['detail-icon']}">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                </div>
                                <div class="${styles['detail-content']}">
                                    <label class="${styles['detail-label']}">Created At</label>
                                    <span class="${styles['detail-value']}" id="client-createdAt"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="${styles['modal-footer']}">
                    <button id="exit" class="${styles['btn-secondary']}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        Cancel
                    </button>
                    <button id="proceed" class="${styles['btn-primary']}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 18l6-6-6-6"></path>
                        </svg>
                        Proceed
                    </button>
                </div>
            </div>
        </div>
    `;

    return modal;
}