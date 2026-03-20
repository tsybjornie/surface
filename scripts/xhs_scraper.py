import os
import json
import time
import uuid
import urllib.request
import urllib.parse
from typing import List, Dict, Any

try:
    from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError
except ImportError:
    print("Playwright not installed. Mock mode will be used by default.")
    sync_playwright = None

class XHSScraper:
    """
    Xiaohongshu (XHS) Scraping Engine.
    Target: High-aesthetic 'Wabi-Sabi' visuals, Microcement, Lime wash, Shikkui.
    """
    def __init__(self, output_dir: str = "data/xhs_wabi_sabi", mock: bool = False):
        self.output_dir = output_dir
        self.mock = mock or (sync_playwright is None)
        self.keywords = [
            "Wabi-Sabi interior",
            "Microcement",
            "Lime wash",
            "Shikkui"
        ]
        os.makedirs(self.output_dir, exist_ok=True)
        self.results_file = os.path.join(self.output_dir, "xhs_data.json")
    
    def scrape(self, num_projects: int = 10):
        all_data = []
        
        if self.mock:
            print("Running in MOCK mode. Generating robust template data...")
            for kw in self.keywords:
                all_data.extend(self._generate_mock_data(num_projects, kw))
        else:
            print("Running in REAL mode using Playwright...")
            with sync_playwright() as p:
                # Headless=False helps bypass some basic bot detection
                browser = p.chromium.launch(headless=False)
                context = browser.new_context(
                    viewport={'width': 1920, 'height': 1080},
                    user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                )
                page = context.new_page()
                
                try:
                    for keyword in self.keywords:
                        print(f"Searching for keyword: {keyword}")
                        search_url = f"https://www.xiaohongshu.com/search_result?keyword={urllib.parse.quote(keyword)}&source=web_search_result_notes"
                        page.goto(search_url)
                        
                        # Wait for page load / manual captcha resolution if necessary
                        time.sleep(5) 
                        
                        # NOTE: XHS DOM changes frequently. This is a template for extraction logic.
                        # Real implementation requires handling login modals, scroll loading, and complex selectors.
                        items_found = self._extract_from_dom(page, keyword, num_projects)
                        all_data.extend(items_found)
                        
                except Exception as e:
                    print(f"An error occurred during scraping: {e}")
                finally:
                    browser.close()

        # Download top images and save descriptions
        self._process_data(all_data)
        
    def _extract_from_dom(self, page, keyword: str, limit: int) -> List[Dict[str, Any]]:
        """
        Template for actual DOM extraction logic.
        Since XHS is heavily protected, we fallback to mock data generation 
        for the starting template if real scraping fails or is incomplete.
        """
        print(f"Extracting DOM for {keyword}...")
        # Example selector logic:
        # notes = page.query_selector_all('section.note-item')
        # ... iteration and extraction ...
        
        return self._generate_mock_data(limit, keyword)

    def _generate_mock_data(self, num_projects: int, keyword: str) -> List[Dict[str, Any]]:
        data = []
        for i in range(num_projects):
            project_id = str(uuid.uuid4())[:8]
            data.append({
                "id": project_id,
                "keyword": keyword,
                "title": f"{keyword} Inspiration {i+1}",
                "description": f"Exploring the beauty of {keyword}. Perfect aesthetic for the new PMOS mineral studio standard. High-quality textures and breathable surfaces.",
                # Using placeholder image service for robust testing
                "image_url": f"https://picsum.photos/seed/{project_id}/800/600",
                "source": "xiaohongshu"
            })
        return data

    def _process_data(self, data: List[Dict[str, Any]]):
        processed_data = []
        for item in data:
            print(f"Processing item for {item['keyword']}: {item['title']}")
            
            # Download image into the data directory
            safe_kw = item['keyword'].replace(' ', '_').lower()
            image_filename = f"{safe_kw}_{item['id']}.jpg"
            image_path = os.path.join(self.output_dir, image_filename)
            
            try:
                urllib.request.urlretrieve(item['image_url'], image_path)
                item['local_image_path'] = image_path
                processed_data.append(item)
            except Exception as e:
                print(f"Failed to download image {item['image_url']}: {e}")
        
        # Save descriptions to JSON for Avatar pipeline
        with open(self.results_file, 'w', encoding='utf-8') as f:
            json.dump(processed_data, f, indent=4, ensure_ascii=False)
        
        print(f"\n[+] Scraping complete.")
        print(f"[+] Downloaded {len(processed_data)} items and images to {self.output_dir}.")
        print(f"[+] Data saved to {self.results_file}")

if __name__ == "__main__":
    print("Initializing XHS Scraping Engine (Organic Whack Module)...")
    
    # We use mock=True by default for the robust starting template 
    # as bypassing XHS login/captcha requires manual intervention or advanced stealth.
    scraper = XHSScraper(output_dir="data/xhs_wabi_sabi", mock=True)
    
    # Target: first 10 projects for the keywords
    scraper.scrape(num_projects=10)
