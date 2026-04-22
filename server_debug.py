import paramiko
import os

def deploy_fixes(host, user, password):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(host, username=user, password=password, timeout=10)
        sftp = client.open_sftp()
        
        # Paths to push (upload to /tmp first)
        files_to_push = [
            ("e:/FDBTalent/online-exam/frontend/src/app/api/proxy/[...path]/route.ts", "/tmp/route.ts", "/home/vinhdq/online-exam/frontend/src/app/api/proxy/[...path]/route.ts"),
            ("e:/FDBTalent/online-exam/frontend/src/lib/api.ts", "/tmp/api.ts", "/home/vinhdq/online-exam/frontend/src/lib/api.ts")
        ]
        
        move_cmds = []
        for local_path, tmp_path, final_path in files_to_push:
            print(f"Uploading {local_path} to {tmp_path}...")
            sftp.put(local_path, tmp_path)
            move_cmds.append(f"echo {password} | sudo -S mv {tmp_path} '{final_path}'")
        
        sftp.close()
        
        print("Upload complete. Moving files and rebuilding frontend...")
        
        # Execute move and rebuild
        cmds = move_cmds + [
            "cd /home/vinhdq/online-exam && echo vinhdq | sudo -S docker-compose build frontend",
            "cd /home/vinhdq/online-exam && echo vinhdq | sudo -S docker-compose up -d frontend"
        ]
        full_cmd = " && ".join(cmds)
        
        stdin, stdout, stderr = client.exec_command(full_cmd)
        print("STDOUT:\n", stdout.read().decode())
        print("STDERR:\n", stderr.read().decode())
        
        print("Done deploying!")
        
    except Exception as e:
        print(f"SSH Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    deploy_fixes("112.137.143.139", "vinhdq", "vinhdq")
