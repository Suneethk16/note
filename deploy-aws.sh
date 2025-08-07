#!/bin/bash

echo "🚀 Deploying to AWS EKS..."

# Step 1: Create EKS cluster (if not exists)
echo "Creating EKS cluster..."
eksctl create cluster --name notes-app --region us-west-2 --nodegroup-name standard-workers --node-type t3.medium --nodes 2 --nodes-min 1 --nodes-max 3

# Step 2: Update kubeconfig
echo "Updating kubeconfig..."
aws eks update-kubeconfig --region us-west-2 --name notes-app

# Step 3: Deploy PostgreSQL
echo "Deploying PostgreSQL..."
kubectl apply -f infra/postgres-deployment.yml

# Step 4: Deploy backend
echo "Deploying backend..."
kubectl apply -f infra/backend-deployment.yml
kubectl apply -f infra/backend-service.yml

# Step 5: Deploy frontend
echo "Deploying frontend..."
kubectl apply -f infra/frontend-deployment.yml
kubectl apply -f infra/frontend-service.yml

# Step 6: Get LoadBalancer URL
echo "Waiting for LoadBalancer..."
kubectl get services -w

echo "✅ Deployment complete!"
echo "Your app will be available at the LoadBalancer URL shown above."