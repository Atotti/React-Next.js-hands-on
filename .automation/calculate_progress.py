import os
import sys

def calculate_progress(branch_name, chapter_name):
    # ブランチとチャプターに対応するディレクトリのパスを作成します
    directory_path = os.path.join(branch_name, chapter_name)

    # ディレクトリが存在しない場合は、進捗を0とします
    if not os.path.exists(directory_path):
        return 0

    # ディレクトリ内のファイル数をカウントします
    file_count = len(os.listdir(directory_path))

    # ファイル数をパーセンテージに変換します（ここでは、1ファイルが1%の進捗を表すと仮定します）
    progress = min(file_count, 100)  # 進捗は最大100%とします

    return progress

if __name__ == "__main__":
    # コマンドライン引数からブランチ名とチャプター名を取得します
    branch_name = sys.argv[1]
    chapter_name = sys.argv[2]

    # 進捗を計算します
    progress = calculate_progress(branch_name, chapter_name)

    # 進捗を出力します
    print(progress)