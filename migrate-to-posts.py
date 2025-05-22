import os
import subprocess
import datetime
import shutil
from pathlib import Path

def get_last_git_change_date(file_path):
    """
    Retrieves the last commit date of a file using Git.

    Args:
        file_path (str): The path to the file.

    Returns:
        str: The last commit date in ISO format (YYYY-MM-DD HH:MM:SS), or None if an error occurs or the file is not tracked by Git.
    """
    try:
        result = subprocess.run(['git', 'log', '-n', '1', '--pretty=format:%aI', '--', file_path], capture_output=True, text=True, check=True)
        if result.stdout.strip():
             # Convert to datetime object and then format it
            datetime_obj = datetime.datetime.fromisoformat(result.stdout.strip().replace('Z', '+00:00'))
            return datetime_obj.strftime('%Y-%m-%d')
        else:
            return None
    except subprocess.CalledProcessError:
        return None
    except FileNotFoundError:
        return None

def copy_file(src_file, target_dir, prefix):
    new_file = prefix + "-" + os.path.basename(src_file)
    target_file = os.path.join(target_dir, new_file)
    print(f"new file: {target_file}")
    shutil.copy2(src_file, target_file)

def change_src_file_contents(src_file, prefix):
    new_file = prefix + "-" + os.path.basename(src_file)
    redirect_to = "/blog/" +  Path(new_file).stem
    with open(src_file, 'w') as file:
        new_contents = f'''---
layout: redirect
redirect_to: '{redirect_to}'
---
'''
        print(new_contents)
        file.write(new_contents)

def transform_files(src_dir, target_dir, extensions):
    """
    Lists files in a directory with specific extensions and their last Git commit dates.

    Args:
        directory (str): The directory to search.
        extensions (tuple): A tuple of file extensions to filter by (e.g., ('.txt', '.py')).
    """
    for root, _, files in os.walk(src_dir):
        for file in files:
            if file.lower().endswith(extensions):
                file_path = os.path.join(root, file)
                last_changed = get_last_git_change_date(file_path)
                print(f"File: {file_path}, Last Changed: {last_changed if last_changed else 'Not tracked or no commits'}")
                #copy_file(file_path, target_dir, last_changed)
                change_src_file_contents(file_path, last_changed)

if __name__ == "__main__":
    src_dir = "./blog"  # Current directory
    target_dir = "./_posts"
    file_extensions = (".md")  # Specify the desired file extensions
    transform_files(src_dir, target_dir, file_extensions)